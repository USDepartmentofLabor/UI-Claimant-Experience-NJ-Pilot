# -*- coding: utf-8 -*-
import os
import sys
import logging
import json
import boto3
import botocore

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa

from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes

logger = logging.getLogger()
logger.setLevel(logging.INFO)

cert_authority_arn = os.getenv("CERT_AUTHORITY_ARN")

acm_client = boto3.client("acm-pca")
ecs_client = boto3.client("ecs")
secrets_manager_client = boto3.client("secretsmanager")


def lambda_handler(event, context):
    app_common_name = event["app_common_name"]
    secrets_manager_secret_name = event["secrets_manager_secret_name"]

    # Generate a key
    key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
    )

    # Generate a CSR
    csr = (
        x509.CertificateSigningRequestBuilder()
        .subject_name(
            x509.Name(
                [
                    x509.NameAttribute(NameOID.COMMON_NAME, app_common_name),
                ]
            )
        )
        .sign(key, hashes.SHA256())
    )

    try:
        issue_cert_response = acm_client.issue_certificate(
            CertificateAuthorityArn=cert_authority_arn,
            Csr=csr.public_bytes(serialization.Encoding.PEM),
            SigningAlgorithm="SHA256WITHRSA",
            Validity={"Value": 7, "Type": "DAYS"},
        )
    except botocore.exceptions.ClientError as error:
        logger.error(
            "%s : %s",
            error.response["Error"]["Code"],
            error.response["Error"]["Message"],
        )
        sys.exit(1)

    try:
        waiter = acm_client.get_waiter("certificate_issued")
        waiter.wait(
            CertificateAuthorityArn=cert_authority_arn,
            CertificateArn=issue_cert_response["CertificateArn"],
        )
    except botocore.exceptions.ClientError as error:
        logger.error(
            "%s : %s",
            error.response["Error"]["Code"],
            error.response["Error"]["Message"],
        )
        sys.exit(1)

    try:
        response = acm_client.get_certificate(
            CertificateAuthorityArn=cert_authority_arn,
            CertificateArn=issue_cert_response["CertificateArn"],
        )
    except botocore.exceptions.ClientError as error:
        logger.error(
            "%s : %s",
            error.response["Error"]["Code"],
            error.response["Error"]["Message"],
        )
        sys.exit(1)

    cert_obj = {}
    cert_obj[
        "certificate_chain"
    ] = f"{response['Certificate']}\n{response['CertificateChain']}"
    cert_obj["private_key"] = key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.NoEncryption(),
    ).decode("utf-8")

    try:
        secrets_manager_client.put_secret_value(
            SecretId=secrets_manager_secret_name,
            SecretString=json.dumps(cert_obj),
        )
    except botocore.exceptions.ClientError as error:
        logger.error(
            "%s : %s",
            error.response["Error"]["Code"],
            error.response["Error"]["Message"],
        )
        sys.exit(1)

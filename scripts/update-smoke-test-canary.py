# -*- coding: utf-8 -*-
import argparse
import botocore
import boto3
import logging
import sys
import time


# Update the AWS Synthetics Canary smoke test to use the specified
# deployment artifact stored in S3
def update_canary():
    logging.basicConfig(
        format="%(asctime)s - %(levelname)s - %(message)s", level=logging.INFO
    )
    logger = logging.getLogger()

    # The deployment artifacts (i.e. the source code for the function's scripts)
    # are stored as zip files in S3. Pass in the S3 bucket and S3 key for where
    # the deployment artifact is located.
    parser = argparse.ArgumentParser()
    parser.add_argument("--bucket", required=True)
    parser.add_argument("--key", required=True)
    args = parser.parse_args()

    bucket = args.bucket
    key = args.key

    client = boto3.client("synthetics")
    canary_name = "intake-app-smoketest"

    # Get the current configuration of the canary
    try:
        response = client.get_canary(Name=canary_name)
    except botocore.exceptions.ClientError as error:
        logger.error(
            "%s : %s",
            error.response["Error"]["Code"],
            error.response["Error"]["Message"],
        )
        sys.exit(1)

    # Update the canary configuration to use the new deployment artifact. All
    # of the other configurations remain the same; we only update the S3Bucket
    # and S3Key parameters here.
    try:
        client.update_canary(
            Name=response["Canary"]["Name"],
            Code={
                "S3Bucket": bucket,
                "S3Key": key,
                "Handler": response["Canary"]["Code"]["Handler"],
            },
            ExecutionRoleArn=response["Canary"]["ExecutionRoleArn"],
            RuntimeVersion=response["Canary"]["RuntimeVersion"],
            Schedule=response["Canary"]["Schedule"],
            RunConfig=response["Canary"]["RunConfig"],
            SuccessRetentionPeriodInDays=response["Canary"][
                "SuccessRetentionPeriodInDays"
            ],
            FailureRetentionPeriodInDays=response["Canary"][
                "FailureRetentionPeriodInDays"
            ],
            ArtifactS3Location="s3://" + response["Canary"]["ArtifactS3Location"],
        )
    except botocore.exceptions.ClientError as error:
        logger.error(
            "%s : %s",
            error.response["Error"]["Code"],
            error.response["Error"]["Message"],
        )
        sys.exit(1)

    # Wait for the update to complete

    wait_for_update = True
    attempt_count = 1
    max_attempts = 20

    while wait_for_update and attempt_count <= max_attempts:
        logger.info("Waiting for canary update to complete")
        try:
            response = client.get_canary(Name=canary_name)
            canary_state_reason_code = response["Canary"]["Status"]["StateReasonCode"]
            if canary_state_reason_code == "UPDATE_COMPLETE":
                logger.info("Canary update complete")
                wait_for_update = False
            else:
                attempt_count += 1
                time.sleep(5)
        except botocore.exceptions.ClientError as error:
            logger.error(
                "%s : %s",
                error.response["Error"]["Code"],
                error.response["Error"]["Message"],
            )
            sys.exit(1)


if __name__ == "__main__":
    update_canary()

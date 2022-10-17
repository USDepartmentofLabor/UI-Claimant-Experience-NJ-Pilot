# -*- coding: utf-8 -*-
import argparse
import boto3
import botocore
import logging
import sys


def main():
    logging.basicConfig(
        format="%(asctime)s - %(levelname)s - %(message)s", level=logging.INFO
    )
    logger = logging.getLogger("db-migration-ecs-task")

    parser = argparse.ArgumentParser()
    parser.add_argument("--taskdef")
    parser.add_argument("--cluster")
    parser.add_argument("--subnet")
    parser.add_argument("--sg")
    args = parser.parse_args()

    task_definition = args.taskdef
    cluster = args.cluster
    subnet = args.subnet
    security_group = args.sg

    client = boto3.client("ecs")

    try:
        response = client.run_task(
            cluster=cluster,
            launchType="FARGATE",
            networkConfiguration={
                "awsvpcConfiguration": {
                    "subnets": [
                        subnet,
                    ],
                    "securityGroups": [
                        security_group,
                    ],
                    "assignPublicIp": "DISABLED",
                }
            },
            taskDefinition=task_definition,
        )
    except botocore.exceptions.ClientError as error:
        logger.error(
            "%s : %s",
            error.response["Error"]["Code"],
            error.response["Error"]["Message"],
        )
        sys.exit(1)

    task_arn = response["tasks"][0]["taskArn"]

    waiter = client.get_waiter("tasks_stopped")
    waiter.wait(cluster=cluster, tasks=[task_arn])

    try:
        response = client.describe_tasks(cluster=cluster, tasks=[task_arn])
    except botocore.exceptions.ClientError as error:
        logger.error(
            "%s : %s",
            error.response["Error"]["Code"],
            error.response["Error"]["Message"],
        )
        sys.exit(1)

    container_exit_code = response["tasks"][0]["containers"][0]["exitCode"]
    exit(container_exit_code)


if __name__ == "__main__":
    main()

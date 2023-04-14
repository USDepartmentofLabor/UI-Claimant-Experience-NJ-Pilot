# -*- coding: utf-8 -*-
import botocore
import boto3
import datetime
import logging
import sys
import time


# Run the AWS Synthetics Canary smoke test
def smoke_test():
    logging.basicConfig(
        format="%(asctime)s - %(levelname)s - %(message)s", level=logging.INFO
    )
    logger = logging.getLogger()

    script_start_time = datetime.datetime.now(datetime.timezone.utc)
    client = boto3.client("synthetics")
    canary_name = "intake-app-smoketest"

    # Start the canary

    try:
        client.start_canary(Name=canary_name)
    except botocore.exceptions.ClientError as error:
        logger.error(
            "%s : %s",
            error.response["Error"]["Code"],
            error.response["Error"]["Message"],
        )
        sys.exit(1)

    # Wait for the canary run to complete

    wait_for_scan = True

    while wait_for_scan:
        logger.info("Waiting for new scan to complete")
        try:
            # There can be a delay before the canary run started above
            # appears in the results from describe_canaries_last_run, so
            # wait until the new run results are available.
            response = client.describe_canaries_last_run(Names=[canary_name])

            last_run_canary_started_time = response["CanariesLastRun"][0]["LastRun"][
                "Timeline"
            ]["Started"]
            last_run_canary_completed_time = response["CanariesLastRun"][0]["LastRun"][
                "Timeline"
            ]["Completed"]
            last_run_canary_state = response["CanariesLastRun"][0]["LastRun"]["Status"][
                "State"
            ]

            # Check that the results for the last canary run started and
            # completed after this current script started. We use this approach
            # because the "start_canary" call does not return output such as a
            # run id.
            if (
                last_run_canary_started_time > script_start_time
                and last_run_canary_completed_time > script_start_time
            ):
                wait_for_scan = False
                logger.info("New scan complete")
                logger.info(last_run_canary_state)
                if last_run_canary_state != "PASSED":
                    sys.exit(1)
            else:
                time.sleep(5)
        except botocore.exceptions.ClientError as error:
            logger.error(
                "%s : %s",
                error.response["Error"]["Code"],
                error.response["Error"]["Message"],
            )
            sys.exit(1)


if __name__ == "__main__":
    smoke_test()

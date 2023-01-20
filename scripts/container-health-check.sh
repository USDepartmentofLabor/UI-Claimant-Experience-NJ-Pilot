#!/usr/bin/env bash
#
# Checks and waits for the docker containers to be healthy
# Adapted from https://github.com/raschmitt/wait-for-healthy-container/blob/master/wait-for-healthy-container.sh

set -eu

echo "Waiting for ${CONTAINER} to be healthy..."
for i in $(seq "${TIMEOUT} "); do
    state=$(docker inspect -f '{{ .State.Health.Status }}' "${CONTAINER}")
    if [ "${state}" -eq 0 ]; then
        echo "${CONTAINER} is healthy after ${i} seconds."
        exit 0
    fi
    sleep 1
done

echo "Timeout exceeded. Health status returned: $(docker inspect -f '{{ .State.Health.Status }}' "${CONTAINER} ")"
exit 1

#!/usr/bin/env bash
#
# Checks and waits for the docker containers to be healthy
# Adapted from https://github.com/raschmitt/wait-for-healthy-container/blob/master/wait-for-healthy-container.sh

set -eu

container_name=$1
timeout=$2

default_timeout=120
if [ -z "${timeout}" ]; then
    timeout=${default_timeout}
fi

echo "Waiting for ${container_name} to be healthy..."
for i in $(seq "${timeout} "); do
    state=$(docker inspect -f '{{ .State.Health.Status }}' "${container_name}")
    if [ "${state}" -eq 0 ]; then
        echo "${container_name} is healthy after ${i} seconds."
        exit 0
    fi
    sleep 1
done

echo "Timeout exceeded. Health status returned: $(docker inspect -f '{{ .State.Health.Status }}' "${container_name} ")"
exit 1

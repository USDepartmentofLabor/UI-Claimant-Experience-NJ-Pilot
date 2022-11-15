#! /bin/bash
#
# Snapshots current state of RDS

set -eu

# Snapshot ID `rdsss-epoch`
SSID="${RDS_INSTANCE}"-$(date +"%s")

# Wait for DB instance to be available
aws rds wait db-instance-available \
  --db-instance-identifier "${RDS_INSTANCE}"

# Create Snapshot
aws rds create-db-snapshot \
  --db-instance-identifier "${RDS_INSTANCE}" \
  --db-snapshot-identifier "$SSID" --tags Key=sha,Value="${IMAGE_TAG}" >/dev/null

# Wait for DB snapshot to be available
aws rds wait db-snapshot-available \
  --db-instance-identifier "${RDS_INSTANCE}" \
  --db-snapshot-identifier "$SSID"

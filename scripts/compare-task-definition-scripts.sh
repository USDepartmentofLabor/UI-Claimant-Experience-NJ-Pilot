#!/usr/bin/env bash
#
# The purpose of this script is to verify that the switch to the new script for
# producing the application's ECS task definition
# (scripts/create-task-definition.py) will produce the same output as the
# current script (scripts/render-task-definition) and not introduce any
# regressions or unintended configurations.

set -u

# Input parameters:
# 1: app_name
# 2: app_environment
# 3: pr_number
compare_task_definition_scripts() {
  # Handle minor inconsistency in the use of "db-migrate" vs. "db-migrations"
  # in the make target name vs. in the task definition.
  if [[ "$1" == "db-migrate" ]]; then
    prefix=db-migrations
  else
    prefix="$1"
  fi

  # If PR number is not 0, it's a preview deployment.
  # The existing script uses APP_PLACEHOLDER that can be client, server, or
  # preview.  The new script consolidates the three existing JSON templates and
  # introduces an "app" parameter that can be client, server, db-migrate. The
  # new script uses the presence of a PR number to determine if it's a preview
  # deploy. The hope is that this change and consolidating the three JSON
  # templates into one dynamic script will simplify things in the long run.
  if [[ "$3" == "0" ]]; then
    appname="$1"
  else
    appname=preview
  fi

  # Create task definition using existing make target and script
  make -s "$prefix"-task-definition app="$appname" environment="$2" pr="$3"

  # Create task definition using new make target and script
  make -s "$prefix"-task-definition-v2 environment="$2" pr="$3"

  # Compare the two .json output files. No differences expected.
  diff <(jq --sort-keys . ./ops/ecs/"$prefix"-task-definition.json) <(jq --sort-keys . ./ops/ecs/"$prefix"-task-definition-v2.json)
}

# Iterate through permutations of the new script's input parameters
for app_environment in "dev" "test" "prod"; do
  for pr_number in "0" "1" "10" "200" "3000"; do
    for app_name in "client" "server" "db-migrate"; do
      echo "comparing: $app_name, $app_environment, $pr_number"
      compare_task_definition_scripts "$app_name" "$app_environment" "$pr_number"
    done
  done
done

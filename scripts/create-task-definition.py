#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
# Construct ECS task definitions for the claimant intake application.

import argparse
import json

parser = argparse.ArgumentParser()
parser.add_argument("--app", required=True, choices=["client", "server", "db-migrate"])
parser.add_argument("--environment", required=True, choices=["dev", "test", "prod"])
parser.add_argument(
    "--pr", default="0", help="Pull request number for preview deployment"
)
parser.add_argument(
    "--otel", action="store_true", help="Include OTEL collector sidecar"
)
parser.add_argument(
    "--envoy",
    action="store_true",
    help="Include Envoy sidecar and AppMesh proxy configuration",
)
args = parser.parse_args()

app = args.app
environment = args.environment
pr = args.pr
envoy = args.envoy
otel = args.otel


# Configure the secrets section of the task definition. This can consist of SSM
# parameter names or Secrets Manager ARNs, and the environment variable they
# are mapped to within a running container.
#
# DO NOT store the secret values here. The values of the secrets are stored in
# AWS. The configurations below instruct ECS where to pull the secrets from
# when deploying a container.
#
# Format example:
#   secrets.append(ssm_param(ssm-paramter-name, environment-variable-name))
def app_secrets():
    secrets = []
    if app == "client":
        secrets.append(ssm_param("cognito-client-id", "COGNITO_CLIENT_ID"))
        secrets.append(ssm_param("cognito-client-secret", "COGNITO_CLIENT_SECRET"))
        secrets.append(ssm_param("cognito-issuer", "COGNITO_ISSUER"))
        secrets.append(ssm_param("cognito-domain", "COGNITO_DOMAIN"))
        secrets.append(ssm_param("cognito-idp-name", "COGNITO_IDENTITY_PROVIDER_NAME"))
        secrets.append(ssm_param("enable-idp-redirect", "ENABLE_IDP_REDIRECT"))
        secrets.append(ssm_param("nextauth-secret", "NEXTAUTH_SECRET"))
        secrets.append(ssm_param("nextauth-url" + pr_info("/"), "NEXTAUTH_URL"))
        secrets.append(ssm_param("server-base-url", "SERVER_BASE_URL"))
    elif app == "server":
        secrets.append(ssm_param("database-host", "DB_HOST"))
        secrets.append(ssm_param("database-port", "DB_PORT"))
        secrets.append(ssm_param("database-name", "DB_NAME"))
        secrets.append(ssm_param("loops-host", "WGPM_HOST"))
        secrets.append(ssm_param("loops-path", "WGPM_PATH"))
        secrets.append(ssm_param("s3-claims-bucket", "S3_CLAIMS_BUCKET"))
        secrets.append(
            ssm_param("s3-claims-bucket-kms-key", "S3_CLAIMS_BUCKET_KMS_KEY")
        )
        secrets.append(ssm_param("cognito-issuer", "COGNITO_ISSUER"))
    elif app == "db-migrate":
        secrets.append(ssm_param("database-host", "DB_HOST"))
        secrets.append(ssm_param("database-port", "DB_PORT"))
        secrets.append(ssm_param("database-name", "DB_NAME"))
        secrets.append(ssm_param("database-user", "DB_USER"))
        secrets.append(ssm_param("database-password", "DB_PASSWORD"))
    return secrets


# Format the SSM parameter information (name and environment variable) in the
# expected JSON format
def ssm_param(param_name, env_var_name):
    return {
        "valueFrom": f"/dol-ui-claimant-intake-{environment}/{param_name}",
        "name": f"{env_var_name}",
    }


# Configure the environment variables section of the task definition. These are
# for non-sensitive environment variables that are safe to hard-code in the
# repository.
def app_environment_variables():
    environment_variables = []
    if app == "server":
        environment_variables.append(
            {"name": "SPRING_PROFILES_ACTIVE", "value": f"aws,aws-{environment}"}
        )
        if otel:
            environment_variables.append(
                {
                    "name": "JAVA_TOOL_OPTIONS",
                    "value": "-javaagent:/app/aws-opentelemetry-agent.jar",
                }
            )
            environment_variables.append(
                {
                    "name": "OTEL_RESOURCE_ATTRIBUTES",
                    "value": f"service.name=dol-ui-claimant-intake-{app}-{environment}",
                }
            )
    elif app == "db-migrate":
        environment_variables.append(
            {"name": "SPRING_PROFILES_ACTIVE", "value": "migrations"}
        )
    return environment_variables


# Task-level memory settings
task_memory = {
    "client": "512",
    "server": "2048",
    "db-migrate": "512",
}

# Task-level CPU settings
task_cpu = {
    "client": "256",
    "server": "1024",
    "db-migrate": "256",
}


# Format the pull request with a prefix character. Default is a hyphen.
#
# Examples:
#   -123
#   /123
def pr_info(prefix="-"):
    if pr == "0":
        return ""
    else:
        return f"{prefix}{pr}"


# Return the application's container port
def app_port():
    return 3000 if app == "client" else 8080


# Construct the port mapping information
def app_port_mappings():
    if app == "client" or app == "server":
        return [
            {"hostPort": app_port(), "protocol": "tcp", "containerPort": app_port()}
        ]


# Construct the mount point information
def app_mount_points():
    if app == "server":
        return [{"containerPath": "/tmp/app", "sourceVolume": "app_tmp"}]
    return []


# Configure the container dependency information
def depends_on(dependency):
    dep = {}
    dep["containerName"] = dependency
    if dependency == "envoy":
        dep["condition"] = "HEALTHY"
    else:
        dep["condition"] = "START"
    return dep


# Task-level volumes used by the application container
def app_volumes():
    if app == "server":
        return [{"name": "app_tmp"}]
    return []


# Proxy configuration for AppMesh/Envoy
def proxy_configuration():
    return {
        "containerName": "envoy",
        "type": "APPMESH",
        "properties": [
            {"name": "IgnoredUID", "value": "1337"},
            {"name": "IgnoredGID", "value": ""},
            {"name": "AppPorts", "value": str(app_port())},
            {"name": "ProxyIngressPort", "value": "15000"},
            {"name": "ProxyEgressPort", "value": "15001"},
            {"name": "EgressIgnoredPorts", "value": ""},
            {"name": "EgressIgnoredIPs", "value": "169.254.170.2,169.254.169.254"},
        ],
    }


# Task-level volumes used by the Envoy sidecar
def envoy_volumes():
    return {"name": "envoy_tmp"}


# Construct the Envoy sidecar container definition
def envoy_container_definition():
    container_definition = {}
    container_definition["name"] = "envoy"
    container_definition["image"] = None
    container_definition["secrets"] = []
    container_definition["secrets"].append(
        ssm_param(f"{app}-app-mesh-resource-arn", "APPMESH_RESOURCE_ARN")
    )
    container_definition["essential"] = True
    container_definition["readonlyRootFilesystem"] = True
    container_definition["memory"] = "500"
    container_definition["mountPoints"] = [
        {"containerPath": "/tmp", "sourceVolume": "envoy_tmp"}
    ]
    container_definition["healthCheck"] = {
        "command": [
            "CMD-SHELL",
            "curl -s http://localhost:9901/server_info | grep state | grep -q LIVE",
        ],
        "startPeriod": 10,
        "interval": 5,
        "timeout": 2,
        "retries": 3,
    }
    container_definition["logConfiguration"] = {
        "logDriver": "awslogs",
        "options": {
            "awslogs-group": f"/ecs/{environment}/dol-ui-claimant-intake-{app}-envoy",
            "awslogs-region": "us-east-1",
            "awslogs-stream-prefix": "envoy",
        },
    }
    container_definition["user"] = "1337"
    return container_definition


# Construct the OTEL collector sidecar container definition
def otel_container_definition():
    container_definition = {}
    container_definition["name"] = "aws-otel-collector"
    container_definition["image"] = None
    container_definition["command"] = ["--config=/etc/ecs/ecs-default-config.yaml"]
    container_definition["essential"] = True
    container_definition["logConfiguration"] = {
        "logDriver": "awslogs",
        "options": {
            "awslogs-group": f"/ecs/{environment}/aws-otel-collector",
            "awslogs-region": "us-east-1",
            "awslogs-stream-prefix": "ecs",
        },
    }
    if envoy:
        container_definition.setdefault("dependsOn", []).append(depends_on("envoy"))
    container_definition["healthCheck"] = {
        "command": ["/healthcheck"],
        "interval": 5,
        "timeout": 6,
        "retries": 5,
        "startPeriod": 1,
    }
    container_definition["readonlyRootFilesystem"] = True
    return container_definition


# Construct the primary application container definition
def app_container_definition():
    container_definition = {}
    container_definition["logConfiguration"] = {
        "logDriver": "awslogs",
        "options": {
            "awslogs-group": f"/ecs/{environment}/dol-ui-claimant-intake-"
            + (f"{app}" if pr == "0" else "preview"),
            "awslogs-region": "us-east-1",
            "awslogs-stream-prefix": "dol-ui-claimant-intake-"
            + (f"{app}" if pr == "0" else "preview")
            + pr_info(),
        },
    }
    container_definition["portMappings"] = app_port_mappings()
    container_definition["secrets"] = app_secrets()
    container_definition["image"] = None
    container_definition["essential"] = True
    container_definition["readonlyRootFilesystem"] = True
    container_definition["name"] = (
        f"dol-ui-claimant-intake-{app}-{environment}" + pr_info()
    )
    container_definition["environment"] = app_environment_variables()
    container_definition["mountPoints"] = app_mount_points()
    container_definition["volumesFrom"] = []
    if otel:
        container_definition.setdefault("dependsOn", []).append(
            depends_on("aws-otel-collector")
        )
    if envoy:
        container_definition.setdefault("dependsOn", []).append(depends_on("envoy"))
    return container_definition


# Top-level function to build the task definition. It invokes the helper functions above.
def create_task_definition():
    task_def = {}
    task_def["family"] = f"dol-ui-claimant-intake-{app}-{environment}" + pr_info()
    task_def[
        "executionRoleArn"
    ] = f"ecs-task-execution-role-dol-ui-claimant-intake-{app}-{environment}"
    task_def[
        "taskRoleArn"
    ] = f"ecs-task-role-dol-ui-claimant-intake-{app}-{environment}"
    task_def["cpu"] = task_cpu[app]
    task_def["memory"] = task_memory[app]
    task_def["networkMode"] = "awsvpc"
    task_def["requiresCompatibilities"] = ["FARGATE"]
    task_def["placementConstraints"] = []

    task_def["containerDefinitions"] = []
    task_def["volumes"] = app_volumes()

    task_def["containerDefinitions"].append(app_container_definition())
    if otel:
        task_def["containerDefinitions"].append(otel_container_definition())
    if envoy:
        task_def["containerDefinitions"].append(envoy_container_definition())
        task_def["volumes"].append(envoy_volumes())
        task_def["proxyConfiguration"] = proxy_configuration()

    print(json.dumps(task_def, sort_keys=True))


if __name__ == "__main__":
    create_task_definition()

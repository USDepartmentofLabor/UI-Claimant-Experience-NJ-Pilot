# AWS Distro for OpenTelemetry (ADOT)

## Introduction

From the AWS [introduction](https://aws-otel.github.io/):

> AWS Distro for OpenTelemetry is a secure, production-ready, AWS-supported
> distribution of the OpenTelemetry project. Part of the Cloud Native Computing
> Foundation, OpenTelemetry provides open source APIs, libraries, and agents to
> collect distributed traces and metrics for application monitoring. With AWS
> Distro for OpenTelemetry, you can instrument your applications just once to
> send correlated metrics and traces to multiple AWS and Partner monitoring
> solutions. Use auto-instrumentation agents to collect traces without changing
> your code. AWS Distro for OpenTelemetry also collects metadata from your AWS
> resources and managed services, so you can correlate application performance
> data with underlying infrastructure data, reducing the mean time to problem
> resolution. Use AWS Distro for OpenTelemetry to instrument your applications
> running on Amazon Elastic Compute Cloud (EC2), Amazon Elastic Container
> Service (ECS), and Amazon Elastic Kubernetes Service (EKS) on EC2, AWS
> Fargate, and AWS Lambda, as well as on-premises.

The AWS Distro for OpenTelemetry provides auto-instrumentation agents and SDKs
for multiple programming languages (e.g., Java, Python, JavaScript).

Telemetry data can be exported to multiple locations, including Amazon
CloudWatch, AWS X-Ray, Splunk, and New Relic.

## Components

Using ADOT involves two key components: (1) an **agent** or SDK to generate
telemetry data, and (2) a **collector** to export the data to observability
tools where the telemetry data can be analyzed and visualized.

### Agent

For the initial proof-of-concept work with ADOT, the claimant intake application
instrumented the Spring Boot server using the default, autoconfiguration options
provided by the
[aws-otel-java-instrumentation](https://github.com/aws-observability/aws-otel-java-instrumentation)
agent.

#### Dockerfile

The agent is downloaded during the Docker image build stage and included in the
application's deployed Docker image. Those parts of `server/Dockerfile`
are shown below:

```
FROM ... AS builder

# ...

ARG ADOT_VERSION=1.21.1
ARG ADOT_SHA256SUM=e064b0e176b314ede5141e67f948850acc5d5fbd464e478086903e4170dd8a2a

RUN curl -sSLO https://github.com/aws-observability/aws-otel-java-instrumentation/releases/download/v"${ADOT_VERSION}"/aws-opentelemetry-agent.jar \
  && [ "$(sha256sum aws-opentelemetry-agent.jar | cut -f1 -d' ')" = "${ADOT_SHA256SUM}" ]

# ...

FROM gcr.io/distroless/java-base-debian11:nonroot

# ...

COPY --from=builder /app/aws-opentelemetry-agent.jar .

# ...
```

The Dockerfile specifies the ADOT version to use and the expected sha256sum of
the agent jar file. AWS does not publish a sha256sum of the jar file. When
upgrading to a new version of the ADOT agent, generating the sha for inclusion
in the Dockerfile is a manual process that involves running the `sha256sum`
command locally against a downloaded copy of a new jar file and updating the
Dockerfile to include the new sha. This provides a modest check that a specific
version of the agent does not change unexpectedly in future downloads.

#### ECS task definition

Using the agent also requires modification to the server's ECS task definition
(`ops/ecs/server-task-definition.json.tmpl`).

Update the container definition for
`dol-ui-claimant-intake-server-ENVIRONMENT_PLACEHOLDER`
to include the following environment variables:

```
"environment": [
...
    {
      "name": "JAVA_TOOL_OPTIONS",
      "value": "-javaagent:/app/aws-opentelemetry-agent.jar"
    },
    {
      "name": "OTEL_RESOURCE_ATTRIBUTES",
      "value": "service.name=dol-ui-claimant-intake-server-ENVIRONMENT_PLACEHOLDER"
    }
]
```

Add a dependency on the OTEL collector sidecar container:

```
"dependsOn": [
  {
    "containerName": "aws-otel-collector",
    "condition": "START"
  }
],
```

Add a container definition for the OTEL collector sidecar container:

```
{
  "name": "aws-otel-collector",
  "image": null,
  "command": ["--config=/etc/ecs/ecs-default-config.yaml"],
  "essential": true,
  "logConfiguration": {
    "logDriver": "awslogs",
    "options": {
      "awslogs-group": "/ecs/ENVIRONMENT_PLACEHOLDER/aws-otel-collector",
      "awslogs-region": "us-east-1",
      "awslogs-stream-prefix": "ecs"
    }
  },
  "healthCheck": {
    "command": [ "/healthcheck" ],
    "interval": 5,
    "timeout": 6,
    "retries": 5,
    "startPeriod": 1
  },
  "readonlyRootFilesystem": true
}
```

The AWS OTEL collector Docker image includes several configuration files to
choose from:
https://github.com/aws-observability/aws-otel-collector/tree/main/config/ecs.
For the initial proof of concept, the claimant intake application used
[ecs-default-config.yaml](https://github.com/aws-observability/aws-otel-collector/blob/main/config/ecs/ecs-default-config.yaml).
To use a different configuration, update this line of the container definition:

```
  "command": ["--config=/etc/ecs/ecs-default-config.yaml"],
```

Another option is to [use a custom OpenTelemetry configuration file from SSM Parameter](https://aws-otel.github.io/docs/setup/ecs/config-through-ssm).

### Collector

AWS provides a Docker image for the AWS OTEL collector:
https://gallery.ecr.aws/aws-observability/aws-otel-collector. The claimant
intake application is not able to use that Docker image directly, so we build
and publish a copy to a private ECR repository within the project's AWS
environment.

Updating `ops/otel/Dockerfile` will trigger
the `.github/workflows/build-otel-collector.yml` GitHub Actions workflow
to build and push a new OTEL collector image to ECR.

Once the new image is built, update `.github/actions/deploy-server/action.yml`
to include the new image tag:

```
    - name: Fill in the image ID in the Amazon ECS task definition (otel collector)
      id: task-def-collector
      ...
      with:
        task-definition: ops/ecs/server-task-definition.json
        container-name: aws-otel-collector
        # update the image tag in the line below
        image: ${{ steps.login-ecr.outputs.registry }}/dol-ui-claimant-intake-otel-collector:v0.26.0-20230214215406
```

## Cleanup

To remove the AWS Distro for OpenTelemetry (ADOT) proof of concept:

- `server/Dockerfile`: remove the changes outlined in [Dockerfile](#dockerfile)
- `ops/ecs/server-task-definition.json.tmpl`: remove the changes outline in [ECS
  task definition](#ecs-task-definition)
- Delete the `.github/workflows/build-otel-collector.yml` GitHub Actions workflow
- `.github/actions/deploy-server/action.yml`: remove the `task-def-collector`
  step outlined in [Collector](#collector)

# Image vulnerability scans

## Overview

This project uses the following tools to run image vulnerability scans against
the application's docker images:

- [Trivy](https://github.com/aquasecurity/trivy)
- [Grype](https://github.com/anchore/grype)

The scans check for Common Vulnerabilities and Exposures (CVE) in OS packages
and language-specific packages (Javascript, Java, Python, etc.).

Trivy and Grype are very similar and will typically produce similar results. We
use both for an extra layer of security and redundancy. There are times when
one of the tools will identify a new vulnerability a day or two before the
other, or when an issue with one of the backend or upstream systems is
inaccessible for a brief period of time. By using both tools, we improve the
reliability of our CI/CD image scanning pipeline and have increased confidence
that one will always be available for running scans before code deployments.

## Running in CI

In CI, we run the scans using the vendor-maintained GitHub Actions:

- Trivy's [trivy-action](https://github.com/aquasecurity/trivy-action)
- Grype's [scan-action](https://github.com/anchore/scan-action)

We run the scans in the following places:

- **Pull requests.** If a pull request includes code changes that necessitate
  running end-to-end tests, we run an image scan as part of the end-to-end tests
  (`.github/workflows/build-and-test.yml`). This will identify if new
  vulnerabilities have emerged in existing packages. It will also identify if
  vulnerabilities are present in new packages being added by a pull request. If
  a vulnerability is flagged, it fails the build.
- **Merges to main.** When code is merged to main, images are scanned before
  being deployed to Elastic Container Service (ECS). If a vulnerability is
  identified, the pipeline will exit and not deploy the image.
- **Daily on main.** We have a scheduled workflow that runs image scans daily on
  the `main` branch (`.github/workflows/image-scans.yml`). This is helpful as an
  extra check to ensure we run a scan each day to see if any new vulnerbailities
  have been identified or patched.

## Running locally

Scans can be run locally using the following `Makefile` targets. You must have
`trivy` and/or `grype` installed locally in order to run these `make` commands.
See the Trivy and Grype links at the top of this document for installation
instructions.

```
# NextJS client
make client-image-build
make trivy-scan image=dol-ui-client
make grype-scan image=dol-ui-client

# Spring Boot server
make server-image-build
make trivy-scan image=dol-ui-server
make grype-scan image=dol-ui-server
```

## Configuration

Trivy and Grype are highly configurable. Consult their documentation for full
details.

In CI, many of the options are configured using the actions' input parameters.

Locally, the configurations are set in the following ways:

- Trivy. Command-line arguments used in the `make` target.
- Grype. `.grype.yaml` configuration file. The `.grype.yaml` configuration file
  is also used by the GitHub Action.

## Runbook for triaging image vulnerability findings

This section describes what to do when CI flags a vulnerability in an image
scan.

1. **Read the image scan results.** Go to the Actions tab, find the workflow run
   that identified a finding. Gather basic information about the finding.
   - Was it Trivy or Grype that flagged it?
   - Is the finding related to the NextJS client or the Spring Boot server?
   - Is the finding related to an application package or an OS-level package in
     the base Docker image?
   - Which package/version does the finding relate to?
   - What is the severity of the finding (critical, high, low, etc.)?
1. **Is a fix readily available?** We configure Trivy and Grype to ignore findings
   that do not have fixes available, so in general an image scan should only
   fail if a fix is available. Where this might need further clarification is in
   the case of OS-level packages and Spring Boot managed dependencies. For
   instance, we use
   [distroless](https://github.com/GoogleContainerTools/distroless) base Docker
   images. They use automation to pull in the latest patches, but there can be a
   delay of a day or two before patched images are published. Spring Boot
   provides a curated set of dependencies that have been tested together. If a
   finding relates to a Spring Boot managed dependency, the team
   will need to decide whether to wait until Spring Boot includes a patched
   version or update `server/build.gradle` to override the spring boot managed
   version and upgrade sooner.
1. **Research the finding.** Research the finding as needed for additional details.
   Trivy and Grype will provide links to information about the finding.
   Depending on the finding, other useful resources to consult are the
   [distroless issue
   tracker](https://github.com/GoogleContainerTools/distroless/issues), [Spring
   Boot issue tracker](https://github.com/spring-projects/spring-boot/issues),
   and the issue tracker for the particular package identified in the finding.
1. **Fix now or fix later?** As a general rule, any legitimate finding with a fix
   available should be fixed as soon as possible. But in the course of going
   through the steps above, maybe there are questions about whether the finding
   is a false positive or what the upgrade path is. In those situations, work
   with a team member to decide on the appropriate path forward.
1. If fixing now:
   - Open a pull request to include the version upgrade. Get the PR approved and
     merged.
1. If fixing later:
   - Create a github issue for tracking purposes and eventual remediation of the
     finding. Include information about the finding, why it's not being fixed
     now, and links to any relevant documentation.
   - Open a pull request to add the finding to the Trivy and/or Grype ignore
     lists, as needed. The relevant files are `.trivyignore` and `.grype.yaml`.
   - Get the PR approved and merged.

## Periodic review

Periodically review the Trivy and Grype ignore lists to identify findings that
can be addressed or removed from the ignore list.

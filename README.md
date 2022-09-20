# Unemployment Insurance Claimant Intake

![Test and Lint](https://github.com/newjersey/dol-ui-claimant-intake/actions/workflows/build-and-test.yml/badge.svg)
![Deploy Dev](https://github.com/newjersey/dol-ui-claimant-intake/actions/workflows/deploy-dev.yml/badge.svg)
![Image Scans](https://github.com/newjersey/dol-ui-claimant-intake/actions/workflows/image-scans.yml/badge.svg)

Modern Unemployment Insurance (UI) intake application for the state of New Jersey Department of Labor.

## Set up

This project uses several tools which are either recommended or required for development.

### Recommended tools

This project uses [Make](https://www.gnu.org/software/make/manual/make.html) as a convenience for environment set up
and other development commands.

> #### :information_source: Note:
>
> - On Windows, [Winget](https://docs.microsoft.com/en-us/windows/package-manager/winget/)
>   or [Chocolaty](https://chocolatey.org/) can be used to install Make.
> - It _is_ possible to interact with the project without make. To do so, simply run the commands associated with the
>   corresponding `make` commands from the [Makefile](./Makefile). Setup instructions in this project will assume the
>   installation of Make.

### Required tools

- [Python (with PIP)](https://www.python.org/downloads/)
  - PIP is used to install [pre-commit](https://pre-commit.com/)

#### Client and Cypress (e2e)

- [Node](https://nodejs.org/en/download/)
  - This project's required Node version can be found in [.tool-versions](./.tool-versions)
  - Since [Node versions](https://nodejs.org/en/about/releases/) enter and exit active LTS status regularly, use a
    Node version manager. On Mac use asdf for version management by following these steps:
    - Install asdf if not already installed (https://asdf-vm.com/guide/getting-started.html)
    - Install GnuPG (a prerequisite for asdf controlling Nodejs version)
      ```
      brew install gpg gawk
      ```
    - Install the asdf NodeJS plugin
      ```
      asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
      ```
    - Check that the nodejs plugin installed correctly with the below command
      ```
      asdf plugin list
      ```
      NOTE: you should see 'nodejs' listed in the terminal as a response
    - Install the correct NodeJS version specified in [.tool-versions](./.tool-versions)
      ```
      asdf install nodejs <version number>
      ```
    - Set the version used above to be applied globally
      ```
      asdf global nodejs <version number>
      ```
    - Double check NodeJs is using the correct version
      ```
      node -v
      ```
    - If you have an issue run the following command and then close and re-open your terminal to be sure changes have taken affect
      ```
      asdf reshim nodejs
      ```
    - If you are still running into an issue due to previous installations of node, do the following
      - Add the node version to your path file by opening your startup file (ex. `~/.zshrc` or `~/.bash-profile`) and adding the following to the bottom:
        ```
        export PATH=“/Users/<YourUsername>/.asdf/installs/nodejs/<DesiredVersion>//bin:$PATH”
        ```
      - rerun the asdf reshim command to ensure asdf forces a recheck on your setting
        ```
        asdf reshim nodejs
        ```
      - Close and reopen your terminal and check that node is now on the correct version:
        ```
        node -v
        ```
  - for Windows environments, [nvm-windows](https://github.com/coreybutler/nvm-windows) is highly encouraged.
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/)

#### Server

- [Java](https://adoptium.net/temurin/releases)
  - The above link is directed to the Eclipse Temurin SDK. The Eclipse foundation has taken over AdoptOpenJDK as of 2021
    which is still the best choice for free OpenJDK builds. You can either download and manually install the binaries
    from Adoptium, or use an SDK manager, as outlined below.
  - This project uses the current LTS version of Java, specified in [.tool-versions](./.tool-versions).
  - Since [Java versions](https://www.oracle.com/java/technologies/java-se-support-roadmap.html) now enter and exit
    active LTS on a much faster cadence than in its early days, using a version manager like [asdf](https://asdf-vm.com/)
    is highly encouraged. While asdf is only supported on UNIX-like platforms. WSL is the recommended way to use asdf on
    Windows.
  - With asdf [installed](https://asdf-vm.com/guide/getting-started.html), proceed with installing Java:
    - Add the asdf java plugin
      ```
      asdf plugin-add java
      ```
    - List all available version
      ```
      asdf list-all java
      ```
    - Select and install the java version you would like to use
      ```
      asdf install java {java-release-candidate}
      ```
      Where {java-release-candidate} is the name of the release you would like to use.
      The `temurin-` prefixed candidates are from the AdoptOpenJDK/Adoptium vendor. Make sure _not_ to accidentally
      select the candidates prefixed with `{vendor}-jre-`, as that is just the JRE. Developers will want the JDK.
    - Set the installed version as your global default
      ```
      asdf global java {java-release-candidate}
      ```
    - Set `JAVA_HOME` by adding the relevant initialization script to your shell's initialization file, e.g. for zsh
      shell, add the following to your `~/.zshrc`
      ```
      . ~/.asdf/plugins/java/set-java-home.zsh
      ```
    - Verify the installation of Java
      ```
      java --version
      ```
    - Verify `JAVA_HOME` is set correctly
      ```
      echo $JAVA_HOME
      ```

## Dependencies

The following should install everything you need on macOS:

Sets up pre-commits:

```sh
make dev-deps
```

Sets up client app in `/client`:

```
make client-deps
```

Sets up server app in `/server`:

```
make server-deps
```

Sets up Cypress for end-to-end testing in `/e2e`:

```
make e2e-deps
```

OR run all of the above dependencies:

```
make all-deps
```

## Web client

To run the client server locally:

```
make client-dev
```

## Web server

To run the api server locally:

```
make server-build
make server-bootRun
```

### API documentation

The web server exposes several API endpoints, and uses swagger as a self-documenting API tool.

To use the swagger user interface `/api/swagger-ui.html`

To view the JSON-formatted api documentation, navigate to `/api/v3/api-docs`

## Docker setup

To run the application locally in docker, use:

```sh
make dev-up
```

Or, if you prefer to run the application(s) outside of docker (in dev-mode for example) alongside dockerized services, use:

```sh
make services-up
```

Then, run the relevant application(s) individually.

To shut the docker services down, use:

```sh
make dev-down
```

### LocalStack

The application integrates with AWS services in the deployed environments, such
as Amazon Simple Storage Service (S3), and we use
[LocalStack](https://docs.localstack.cloud/overview/) to emulate those AWS
services locally.

#### Dependency: AWS command-line interface (CLI)

You can use the AWS CLI to interact with the LocalStack environment.

To install the AWS CLI:

```
# MacOS
brew install awscli

# Windows
choco install awscli
```

See [Setting up local region and credentials to run
LocalStack](https://docs.localstack.cloud/integrations/aws-cli/#setting-up-local-region-and-credentials-to-run-localstack)
for instructions to configure the AWS CLI to work with LocalStack.

#### Usage

LocalStack runs as a docker container and will be started along with the other
application services by running the following command:

```
make dev-up
```

To confirm the LocalStack container is running, run the following command:

```
docker compose ps

# The output should include the following container:
NAME                COMMAND                  SERVICE             STATUS              PORTS
dol-ui-localstack   "docker-entrypoint.sh"   localstack          running (healthy)   0.0.0.0:4566->4566/tcp
```

Once the container is running, you can use the AWS CLI to interact
with it by including the `--endpoint-url=<localstack-url>` flag:

```
# to list all buckets in the LocalStack environment
aws --endpoint-url=http://localhost:4566 s3 ls

# to list the objects within a particular bucket, for example:
aws s3api list-objects-v2 --endpoint-url http://localhost:4566 --bucket dol-ui-claims

# to download an object from a particular bucket, for example:
aws s3api get-object --endpoint-url http://localhost:4566 --bucket dol-ui-claims --key "YOUR_OBJECT_KEY_HERE" "NAME_OF_OUTPUT_FILE"
```

## Makefile

Run `make` or `make help` to see the available `make` commands we use with this
repository.

## Testing

### Client tests

To run the Jest unit tests:

```
make client-test
```

To run Jest unit tests that will run with every change:

```
make client-test-watch
```

To run Cypress (e2e) tests:

```
make e2e-test
```

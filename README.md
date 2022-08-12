# Unemployment Insurance Claimant Intake

![Test and Lint](https://github.com/newjersey/dol-ui-claimant-intake/actions/workflows/build-and-test.yml/badge.svg)
![Deploy Dev](https://github.com/newjersey/dol-ui-claimant-intake/actions/workflows/deploy-dev.yml/badge.svg)

Modern Unemployment Insurance (UI) intake application for the state of New Jersey Department of Labor.

## Set up

This project uses several tools which are either recommended or required for development.

### Recommended Tools

This project uses [Make](https://www.gnu.org/software/make/manual/make.html) as a convenience for environment set up
and other development commands.

> #### :information_source: Note:
>
> - On Windows, [Winget](https://docs.microsoft.com/en-us/windows/package-manager/winget/)
>   or [Chocolaty](https://chocolatey.org/) can be used to install Make.
> - It _is_ possible to interact with the project without make. To do so, simply run the commands associated with the
>   corresponding `make` commands from the [Makefile](./Makefile). Setup instructions in this project will assume the
>   installation of Make.

### Required Tools

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
      Where {java-release-candidate} is the name of the release you would like to use, for example `temurin-17.0.3+7`.
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

## Web Client

To run the client server locally:

```
make client-dev
```

## Docker Setup

To run the application locally in docker, use:

```sh
make dev-up
```

To shut the docker services down, use:

```sh
make dev-down
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

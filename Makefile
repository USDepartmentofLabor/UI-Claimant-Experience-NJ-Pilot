ifeq ($(OS), Windows_NT)
SHELL := pwsh.exe
endif

help: ## Print the help documentation
	@grep -E '^[/a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

dev-deps: ## Install local development environment dependencies (depending on your setup, you may have to run pip3)
	pip install pre-commit
	pre-commit install --install-hooks

lint: ## Run lint check
	pre-commit run --all-files

docker-up: ## Run all docker services locally
	SPRING_PROFILES_ACTIVE=local-docker docker compose up --build --force-recreate --remove-orphans

docker-e2e-up: ## Run all docker services in background, with e2e profile (only used for running cypress tests)
	SPRING_PROFILES_ACTIVE=local-docker,e2e docker compose up -d --build --force-recreate --remove-orphans

docker-services-up: ## Run supporting services locally (database, localstack)
	docker compose up db localstack wiremock --build --force-recreate --remove-orphans -d

docker-down: ## Shut down all local docker services
	docker compose down

docker-clean: ## Shut down all local docker services and remove volumes
	docker compose down --volumes

docker-prune: ## Prune system of all containers and volumes. Useful when running into resource issues or if you truly want a clean slate
	docker system prune -af --volumes

docker-reset: docker-clean docker-up ## Runs docker-clean and docker-up

docker-logs: ## View the local docker service logs
	docker compose logs -f

e2e-deps: ## installs dependencies for client
	cd e2e && yarn install --frozen-lockfile

e2e-test-gui-local: ## Runs Cypress tests in browser running the app on localhost
	cd e2e && yarn run cypress open --config "baseUrl=http://localhost:3000" --env SERVER_BASE_URL=http://localhost:8080

e2e-test-gui-local-fast: ## Runs Cypress tests without lighthouse or a11y
	cd e2e && yarn run cypress open --config "baseUrl=http://localhost:3000" --env "SKIP_CHECKS=enabled,SERVER_BASE_URL=http://localhost:8080"

e2e-test-gui-docker: ## Runs Cypress tests in browser running the app dockerized
	cd e2e && yarn run cypress open --config "baseUrl=https://sandbox-claimant-intake:8443" --env SERVER_BASE_URL=https://sandbox-claimant-intake:8443

e2e-test-headless-local: ## Runs Cypress tests on the command line running the app on localhost
	cd e2e && yarn cypress run --headless --browser chrome --config "baseUrl=http://localhost:3000" --env SERVER_BASE_URL=http://localhost:8080

e2e-test-headless-docker: ## Runs Cypress tests on the command line running the app dockerized
	cd e2e && yarn cypress run --headless --browser chrome --config "baseUrl=https://sandbox-claimant-intake:8443" --env SERVER_BASE_URL=https://sandbox-claimant-intake:8443

e2e-compile-check: ## check e2e for typescript compilation
	cd e2e && yarn tsc --noEmit

client-deps: ## installs dependencies for client
	cd client && yarn install --frozen-lockfile

client-test: ## run Jest unit/integration tests
	cd client && yarn test

client-test-coverage: ## run Jest unit/integration tests with coverage
	cd client && yarn test:coverage

client-test-watch: ## run Jest unit/integration tests and watch
	cd client && yarn test --watchAll

client-build: client-deps ## Build the client
	cd client && yarn build

client-image-build: ## Build client docker image
	docker image build -t dol-ui-client:latest client

client-dev: ## Runs the Next/React development server (with automatic reloading)
	cd client && yarn dev

client-prod-start: client-build ## Installs dependencies, builds, and starts the Next/React dev server (production mode)
	cd client && yarn start

client-compile: ## compile client typescript
	cd client && yarn tsc

client-compile-check: ## check client for typescript compilation
	cd client && yarn tsc --noEmit

client-storybook: ## run storybook for the client application
	cd client && yarn storybook

client-task-definition: ## Update the environment placeholders in the client ECS task definition, e.g., dev/test/prod (only used in CI)
	./scripts/render-task-definition --taskdef ops/ecs/client-task-definition.json.tmpl --environment $(environment) --app $(app) --pr $(pr) > ops/ecs/client-task-definition.json

server-gradle-tasks: ## list the gradle tasks that can be run when invoking ./gradlew from the /server directory
	cd server && ./gradlew tasks

server-deps: ## installs dependencies for server
	cd server && ./gradlew assemble

server-spotless: ## runs and applies spotless (formatting) changes
	cd server && ./gradlew :spotlessApply

server-check: ## runs the gradle `check` lifecycle which includes unit tests and other plugin integrations such as Spotbugs
	cd server && ./gradlew check

server-build: ## installs dependencies, compiles code, and runs tests for server
	cd server && ./gradlew build

server-image-build: ## Build server docker image
	docker image build -t dol-ui-server:latest server

server-bootRun: ## Runs the SpringBoot development server with local profile active
	cd server && ./gradlew bootRun --args='--spring.profiles.active=local'

server-bootRun-e2e: ## Runs the SpringBoot development server with local and e2e profiles active (only used for running cypress tests)
	cd server && ./gradlew bootRun --args='--spring.profiles.active=local,e2e'

server-test: ## run server unit tests
	cd server && ./gradlew test

server-test-coverage-report: ## generate server test coverage report
	cd server && ./gradlew jacocoTestReport

server-test-coverage-check: ## verify server test coverage
	cd server && ./gradlew jacocoTestCoverageVerification

server-migration: server-deps ## generate database migrations based on a diff between the current database and the model entities. Use description="a_short_description_of_the_changes"
	cd server && ./gradlew liquibaseDiffChangeLog -PrunList=diffChangeLog -PmigrationDescription="$(description)"

server-migrate: server-deps ## Manually apply migrations to the database (This happens automatically when calling bootRun)
	cd server && ./gradlew liquibaseUpdate

server-migrate-dry-run: server-deps ## Print SQL that would be executed in a `server-migrate`
	cd server && ./gradlew liquibaseUpdateSql

server-rollback: server-deps ## Roll back a given number of change sets. Use number_of_change_sets=n, where 'n' is the number of databasechangelog entries you'd like to rollback
	cd server && ./gradlew liquibaseRollbackCount -PliquibaseCommandValue=$(number_of_change_sets)

server-rollback-dry-run: server-deps ## Print SQL that would be executed in a `server-rollback`
	cd server && ./gradlew liquibaseRollbackCountSql -PliquibaseCommandValue=$(number_of_change_sets)

server-migration-starter-file: ## Create a starter file for raw SQL migration
	./scripts/starter-migration-file

server-clean: ## cleans the build output and incremental build "Up-to-date" checks
	cd server && ./gradlew clean

server-task-definition: ## Update the environment placeholders in the server ECS task definition, e.g., dev/test/prod (only used in CI)
	./scripts/render-task-definition --taskdef ops/ecs/server-task-definition.json.tmpl --environment $(environment) > ops/ecs/server-task-definition.json

db-migrations-task-definition: ## Update the environment placeholders in the db migration ECS task definition, e.g., dev/test/prod (only used in CI)
	./scripts/render-task-definition --taskdef ops/ecs/db-migrations-task-definition.json.tmpl --environment $(environment) > ops/ecs/db-migrations-task-definition.json

wait-for-server: ## Wait for the server health check to return 200
	./scripts/wait-for-url.py --url http://localhost:8080/intake-api/actuator/health

nginx-cert: ## Create a self-signed certificate for local development with nginx
	./scripts/generate-nginx-cert

trivy-scan: ## Run trivy vulnerability scan on an image
	trivy image --ignore-unfixed $(image)

grype-scan: ## Run grype vulnerability scan on an image
	grype $(image)

all-deps: dev-deps client-deps e2e-deps server-deps ## Runs all required dependencies for running the application

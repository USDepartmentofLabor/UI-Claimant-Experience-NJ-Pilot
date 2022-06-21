help: ## Print the help documentation
	@grep -E '^[/a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

dev-deps: ## Install local development environment dependencies
	pip install pre-commit
	pre-commit install --install-hooks

lint: ## Run lint check
	pre-commit run --all-files

dev-up: ## Run all docker services locally
	docker compose up --build --force-recreate

dev-down: ## Shut down all local docker services
	docker compose down

dev-logs: ## View the local docker service logs
	docker compose logs -f

ci-up: ## Run docker services through continuous integration
	docker compose up -d

ci-down: ## Shut down docker services running through continuous integration
	docker compose down

client-test: ## run Jest unit/integration tests
	cd client && yarn test

watch-client-test: ## run Jest unit/integration tests and watch
	cd client && yarn test --watchAll

e2e-deps: ## installs dependencies for client
	cd e2e && yarn install

e2e-test: ## runs Cypress tests in browser
	cd e2e && yarn run cypress open

e2e-ci-test: ## runs Cypress tests on the command line
	cd e2e && yarn cypress run --headless --browser chrome

e2e-compile-check: ## check e2e for typescript compilation
	cd e2e && yarn tsc --noEmit

client-deps: ## installs dependencies for client
	cd client && yarn install --frozen-lockfile

client-build: client-deps ## Build the client
	cd client && yarn build

client-dev: ## Runs the Next/React development server (with automatic reloading)
	cd client && yarn dev

client-prod-start: client-build ## Installs dependencies, builds, and starts the Next/React dev server (production mode)
	cd client && yarn start

client-compile: ## compile client typescript
	cd client && yarn tsc

client-compile-check: ## check client for typescript compilation
	cd client && yarn tsc --noEmit

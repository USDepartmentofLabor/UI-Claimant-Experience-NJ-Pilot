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

client-test: ## run Jest unit/integration tests
	cd client && yarn test

watch-client-test: ## run Jest unit/integration tests and watch
	cd client && yarn test --watchAll

client-deps: ## install client app dependencies
	cd client && yarn install --frozen-lockfile

client-compile: ## compile client typescript
	cd client && yarn tsc

client-compile-check: ## check client for typescript compilation
	cd client && yarn tsc --noEmit

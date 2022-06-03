help: ## Print the help documentation
	@grep -E '^[/a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

dev-deps: ## Install local development environment dependencies
	brew install pre-commit # TODO: Use PIP if/when python is introduced
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

client-deps: ## run dependencies for client
	cd client && yarn install

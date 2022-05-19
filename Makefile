help: ## Print the help documentation
	@grep -E '^[/a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

dev-deps: ## Install local development environment dependencies
	brew install pre-commit # TODO: Use PIP if/when python is introduced
	pre-commit install --install-hooks

lint: ## Run lint check
	pre-commit run --all-files

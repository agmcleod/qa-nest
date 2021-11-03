SHELL := /bin/bash

test_env:
	docker compose -f docker-compose.test.yml up -d

# Build the test environment and run the test suite
test:
	docker compose -f docker-compose.test.yml exec test_api bash -c "yarn && yarn test:e2e"

.PHONY: test
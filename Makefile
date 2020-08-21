
DOCKER_COMPOSE_UP=docker-compose up --no-recreate --remove-orphans -d
DOCKER_COMPOSE_UP_RECREATE=docker-compose up --force-recreate --remove-orphans -d

all: pre-configure configure build vendors start

restart: clean all

pre-configure:
	@echo "Checking docker command"         && command -v "docker" > /dev/null 2>&1            || (echo "You have to install the "docker" command" && false)
	@echo "Checking docker-compose command" && command -v "docker-compose" > /dev/null 2>&1    || (echo "You have to install the "docker-compose" command" && false)

configure:
	test -f docker-compose.override.yml || cp docker-compose.override.yml.dist docker-compose.override.yml
ifeq ($(shell uname -s), Darwin)
	sed -i '' 's/#\(.*\)# Uncomment for MacOS/\1/g' docker-compose.override.yml
endif
	mkdir -p .cache/ssl
	test -f .cache/ssl/local.crt || (docker run --rm -v $$(pwd):/src alpine:3.9 sh -c "apk add openssl && openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /src/.cache/ssl/local.key -out /src/.cache/ssl/local.crt -subj \"/C=FR/ST=Paris/L=Paris/O=Resop/CN=*.resop.docker\" && cat /src/.cache/ssl/local.crt /src/.cache/ssl/local.key > /src/.cache/ssl/local.pem  && chown -R $$(id -u):$$(id -g) /src/.cache")

unconfigure:
	rm -f .env.local docker-compose.override.yml

#
# DOCKER
#

pull:
	docker-compose pull

build:
	docker-compose build --pull

build-prod:
	docker build -t resop:latest -f docker/php-flex/Dockerfile .

start-db:
	$(DOCKER_COMPOSE_UP) mongodb
	docker-compose run --rm wait -c mongodb:27017

start: init-db
	$(DOCKER_COMPOSE_UP_RECREATE) node

stop:
	docker-compose stop

ps:
	docker-compose ps

logs:
	docker-compose logs -f --tail 10

clean: clear-cache
	docker-compose down -v --remove-orphans || true
	rm -f helpme.log
	$(MAKE) -s unconfigure

#
# PROJECT
#

vendors:
	bin/tools npm install

init-db: start-db
	bin/tools bin/post-install-dev.sh

fix-cs:
	bin/tools npm run lint --fix
	bin/tools npm run format

#
# TESTS
#

test: test-cs test-e2e

test-cs:
	bin/node-tools npm run lint

test-e2e:
	npm run test:e2e

test-e2e-watch:
	npm run test:e2e:watch


#
# Help commands
#

helpme:
	@echo "Generating the helpme.log file..."
	@$(MAKE) -s helpme-logs > helpme.log
	@echo "Done, you can send the 'helpme.log' file to your team :)"

helpme-logs:
	$(MAKE) -s pre-configure || true
	@echo "=========================="
	id || true
	@echo "=========================="
	git fetch -ap 2>&1 || true
	git status 2>&1 || true
	@echo "=========================="
	docker info 2>&1 || true
	@echo "=========================="
	docker-compose version 2>&1 || true
	@echo "=========================="
	(command -v "docker-machine" > /dev/null 2>&1 && docker-machine ls) || true
	@echo "=========================="
	(command -v "dinghy" > /dev/null 2>&1 && dinghy status) || true
	@echo "=========================="
	docker-compose config
	@echo "=========================="
	docker ps -a
	@echo "=========================="
	docker-compose ps
	@echo "=========================="
	docker-compose logs --no-color -t --tail=10

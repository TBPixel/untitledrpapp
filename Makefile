build:
	go build -o ./bin/untitledrpapp .

run:
	make build
	./bin/untitledrpapp

heroku:
	git subtree push --prefix untitledrpapp heroku master

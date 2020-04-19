package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/tbpixel/rp-app/backend/pkg/storage"

	"github.com/tbpixel/rp-app/backend/chat"

	"github.com/tbpixel/rp-app/backend/user"

	"github.com/tbpixel/rp-app/backend/pkg/http"
)

func main() {
	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "local"
	}

	domain := os.Getenv("DOMAIN")
	if domain == "" {
		domain = "localhost"
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	secret := os.Getenv("SECRET")
	if secret == "" {
		secret = "secret"
	}

	ctx := context.Background()

	var fs http.FileStorer
	if env == "local" {
		fs = storage.NewLocalStorage(ctx)
	} else {
		// todo: prod storage
	}

	userStore := user.NewMemoryStore()
	auth := user.NewAuth(userStore)
	chats := chat.NewManager(chat.NewMemoryStore())
	users := user.New(userStore)
	sessions := http.NewSessionStore([]byte(secret), os.TempDir(), domain)
	hub := http.NewHub(domain, users, ctx)
	go hub.Listen()

	server := http.NewServer(domain, auth, chats, users, fs, sessions, hub, ctx)

	address := fmt.Sprintf("%s:%s", domain, port)
	log.Printf("server listening @ http://%s", address)
	log.Fatal(http.ListenAndServe(":"+port, server))
}

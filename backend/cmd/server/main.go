package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/tbpixel/rp-app/backend/chat"

	"github.com/tbpixel/rp-app/backend/user"

	"github.com/tbpixel/rp-app/backend/pkg/http"
)

func main() {
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

	userStore := user.NewMemoryStore()
	auth := user.NewAuth(userStore)
	chats := chat.NewManager(chat.NewMemoryStore())
	users := user.New(userStore)
	sessions := http.NewSessionStore([]byte(secret), os.TempDir())
	hub := http.NewHub(domain, users, ctx)
	go hub.Listen()

	server := http.NewServer(auth, chats, users, sessions, hub, ctx)

	address := fmt.Sprintf("%s:%s", domain, port)
	log.Printf("server listening @ http://%s", address)
	log.Fatal(http.ListenAndServe(":"+port, server))
}

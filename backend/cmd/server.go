package main

import (
	"context"
	"flag"
	"log"
	"os"

	"github.com/tbpixel/rp-app/backend/chat"

	"github.com/tbpixel/rp-app/backend/user"

	"github.com/tbpixel/rp-app/backend/pkg/http"
)

var addr = flag.String("addr", ":8080", "http service address")
var secret = flag.String("secret", "secret", "app secret key")

func main() {
	flag.Parse()

	ctx := context.Background()

	userStore := user.NewMemoryStore()
	auth := user.NewAuth(userStore)
	chats := chat.NewManager(chat.NewMemoryStore())
	users := user.New(userStore)
	sessions := http.NewSessionStore([]byte(*secret), os.TempDir())
	hub := http.NewHub(users, ctx)
	go hub.Listen()

	server := http.NewServer(auth, chats, users, sessions, hub, ctx)

	log.Printf("server listening @ http://localhost%s", *addr)
	log.Fatal(http.ListenAndServe(*addr, server))
}

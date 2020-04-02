package main

import (
	"context"
	"encoding/gob"
	"flag"
	"log"

	"github.com/tbpixel/rp-app/backend"

	"github.com/tbpixel/rp-app/backend/user"

	"github.com/tbpixel/rp-app/backend/pkg/http"
)

var addr = flag.String("addr", ":8080", "http service address")
var secret = flag.String("secret", "secret", "app secret key")

func main() {
	flag.Parse()

	ctx := context.Background()

	auth := user.NewAuth(user.NewMemoryStore())
	sessions := http.NewSessionStore([]byte(*secret))
	hub := http.NewHub(ctx)
	go hub.Listen()

	gob.Register(&backend.User{})
	server := http.NewServer(auth, sessions, hub, ctx)

	log.Printf("server listening @ http://localhost%s", *addr)
	log.Fatal(http.ListenAndServe(*addr, server))
}

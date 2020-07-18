package main

import (
	"fmt"

	"github.com/gobuffalo/envy"

	"github.com/TBPixel/untitledrpapp/internal/configs"
	log "github.com/sirupsen/logrus"

	"github.com/TBPixel/untitledrpapp/internal/api"
	"github.com/TBPixel/untitledrpapp/internal/http"
)

func main() {
	_ = envy.Load()

	app, err := configs.NewApp()
	if err != nil {
		log.Fatal(err)
	}

	services := api.Services{}
	mux := http.NewMux(services)

	log.Info(fmt.Sprintf("Server listening at: %s:%v", app.Host, app.Port))
	err = http.ListenAndServe(fmt.Sprintf(":%v", app.Port), mux)
	if err != nil {
		log.Fatal(err)
	}
}

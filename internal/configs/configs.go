package configs

import (
	"strconv"

	"github.com/gobuffalo/envy"
)

// NewApp returns the app config instance,
// using environment variables.
func NewApp() (*App, error) {
	appPort := envy.Get("APP_PORT", "8000")
	port, err := strconv.ParseUint(appPort, 10, 32)
	if err != nil {
		return nil, err
	}

	return &App{
		Name: envy.Get("APP_NAME", "Lorem Ipsum"),
		Host: envy.Get("APP_HOST", "http://localhost"),
		Port: uint(port),
	}, nil
}

// App is a configuration struct
type App struct {
	Name string
	Host string
	Port uint
}

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
		Name:  envy.Get("APP_NAME", "Lorem Ipsum"),
		Host:  envy.Get("APP_HOST", "http://localhost"),
		Port:  uint(port),
		Auth0: NewAuth0(),
	}, nil
}

// App is a configuration struct
type App struct {
	Name  string
	Host  string
	Port  uint
	Auth0 Auth0
}

// NewAuth0 returns an config struct
// filled out using environment variables
func NewAuth0() Auth0 {
	return Auth0{
		Audience: envy.Get("AUTH0_AUDIENCE", ""),
		Domain:   envy.Get("AUTH0_DOMAIN", ""),
	}
}

// Auth0 structures configuration
// relevant to the auth0 integration
type Auth0 struct {
	Audience string
	Domain   string
}

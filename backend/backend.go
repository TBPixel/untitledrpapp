package backend

type User struct {
	ID       string
	Email    string
	Name     string
	Password string
}

type Chat struct {
	ID             string
	ParticipantIDs []string
}

package hash

import (
	"golang.org/x/crypto/bcrypt"
)

// Password accepts a string password and returns either a
// hashed password or an error
func Password(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// PasswordCheck compares a string password against a string
// password hash and returns true if they match
func PasswordCheck(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

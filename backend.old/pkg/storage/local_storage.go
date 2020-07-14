package storage

import (
	"context"
	"fmt"
	"io"
	"io/ioutil"
)

type LocalStorage struct {
	ctx context.Context
}

// Save accepts a source reader and a name, saving
// the given file under the name and persisting
// it to disk.
func (l LocalStorage) Save(name string, reader io.Reader, ctx context.Context) (string, error) {
	path, err := l.persist(name, reader)

	for {
		select {
		case p := <-path:
			return p, nil
		case e := <-err:
			return "", e
		case <-ctx.Done():
			return "", nil
		case <-l.ctx.Done():
			return "", nil
		}
	}
}

func (l LocalStorage) persist(name string, reader io.Reader) (chan string, chan error) {
	pathChan := make(chan string)
	errChan := make(chan error)

	go func() {
		// Create a temporary file within our temp-images directory that follows
		// a particular naming pattern
		tempFile, err := ioutil.TempFile("storage/local", fmt.Sprintf("upload-%s.png", name))
		if err != nil {
			fmt.Println(err)
		}
		defer tempFile.Close()

		// read all of the contents of our uploaded file into a
		// byte array
		fileBytes, err := ioutil.ReadAll(reader)
		if err != nil {
			errChan <- fmt.Errorf("error trying to read bytes from file: %v", err)
			return
		}
		// write this byte array to our temporary file
		_, err = tempFile.Write(fileBytes)
		if err != nil {
			errChan <- fmt.Errorf("error trying to save file to disk: %v", err)
			return
		}

		pathChan <- fmt.Sprintf("/static/%s", tempFile.Name())
	}()

	return pathChan, errChan
}

func NewLocalStorage(ctx context.Context) *LocalStorage {
	return &LocalStorage{
		ctx: ctx,
	}
}

package http

import (
	"context"
	"io"
)

// FileStorer persists files to disk and returns the path to
// the file
type FileStorer interface {
	Save(name string, reader io.Reader, ctx context.Context) (string, error)
}

package main

import (
	"bytes"
	"io"
	"os"
)

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func readAll(r io.Reader, capacity int64) (b []byte, err error) {
	var buf bytes.Buffer
	// If the buffer overflows, we will get bytes.ErrTooLarge.
	// Return that as an error. Any other panic remains.
	defer func() {
		e := recover()
		if e == nil {
			return
		}
		if panicErr, ok := e.(error); ok && panicErr == bytes.ErrTooLarge {
			err = panicErr
		} else {
			panic(e)
		}
	}()
	if int64(int(capacity)) == capacity {
		buf.Grow(int(capacity))
	}
	_, err = buf.ReadFrom(r)
	return buf.Bytes(), err
}

func ReadFile(filename string) ([]byte, error) {
	f, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	// It's a good but not certain bet that FileInfo will tell us exactly how much to
	// read, so let's try it but be prepared for the answer to be wrong.
	var n int64 = bytes.MinRead

	if fi, err := f.Stat(); err == nil {
		// As initial capacity for readAll, use Size + a little extra in case Size
		// is zero, and to avoid another allocation after Read has filled the
		// buffer. The readAll call will read into its allocated internal buffer
		// cheaply. If the size was wrong, we'll either waste some space off the end
		// or reallocate as needed, but in the overwhelmingly common case we'll get
		// it just right.
		if size := fi.Size() + bytes.MinRead; size > n {
			n = size
		}
	}
	return readAll(f, n)
}

func ReadToString(filename string) string {
	s,err:=ReadFile(filename)
	if err != nil {
		return ""
	}
	return string(s)
}
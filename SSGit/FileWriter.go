package main

import (
	"fmt"
	"log"
	"os"
)

func Write(filename string,body string) {

	f, err := os.Create(filename)

	if err != nil {
		log.Fatal(err)
	}

	defer f.Close()

	_, err2 := f.WriteString(body)

	if err2 != nil {
		log.Fatal(err2)
	}

	fmt.Printf("Wrote to file: %s\n",filename)
}
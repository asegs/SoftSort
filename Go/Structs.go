package main

import "bytes"

type SortQuery struct {
	Company string `json:"company"`
	Topic string `json:"topic"`
	Duplicates bool `json:"duplicates"`
	Choices [][]string `json:"choices"`
	Weights []float64 `json:"weights"`
	Count int `json:"count"`
}

type AutoSchemaReq struct{
	Key string `json:"key"`
	Name string `json:"name"`
	Headers bool `json:"headers"`
	Format string `json:"format"`
	Titles []string `json:"titles"`
	File *bytes.Buffer
}

type FirstLine struct {
	Lines [][]string `json:"lines"`
}

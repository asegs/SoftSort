package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

const (
	host =  "localhost"
	port = 5432
	user = "swen344"
	password = "default"
	dbname = "SoftSort"
)

func querySoftSort(w http.ResponseWriter, r *http.Request){
	t := time.Now()
	w.Header().Set("Content-Type","application/json")
	var query SortQuery
	_ = json.NewDecoder(r.Body).Decode(&query)
	_ = json.NewEncoder(w).Encode(softSortOuter(query))
	t1 := time.Now()
	fmt.Println(t1.Sub(t))
}

func initializeAutoschema(w http.ResponseWriter, r *http.Request){
	w.Header().Set("Content-Type","application/json")
	r.ParseMultipartForm(5*1024*1024)
	file, _, err := r.FormFile("file")
	if err != nil {
		return
	}
	defer file.Close()
	buf := bytes.NewBuffer(nil)
	if _, err := io.Copy(buf, file); err != nil {
		return
	}
	headers,_ := strconv.ParseBool(r.FormValue("headers"))
	var titles []string
	if headers{
		titles = getFirstLine(file)
	} else{
		titles = strings.Split(r.FormValue("titles"),",")
	}



	auto := AutoSchemaReq{r.FormValue("key"),r.FormValue("name"),headers,r.FormValue("format"),titles,buf}
	fmt.Println(auto)
}

func getAllFirstLines(w http.ResponseWriter,r *http.Request){
	w.Header().Set("Content-Type","application/json")
	parseErr := r.ParseMultipartForm(25*1024*1024)
	if parseErr != nil{
		parseErr.Error()
	}
	lines := make([][]string,0)
	var err error
	var file multipart.File
	err = nil
	counter := 0
	for err == nil{
		file,_,err = r.FormFile("file"+strconv.Itoa(counter))
		if err != nil{
			break
		}
		lines = append(lines,getFirstLine(file))
		counter++
	}
	fmt.Println("Parsed "+strconv.Itoa(counter)+" files")
	_ = json.NewEncoder(w).Encode(FirstLine{Lines: lines})
}

func merge(w http.ResponseWriter,r *http.Request){
	start := time.Now()
	w.Header().Set("Content-Disposition", "attachment; filename=merged.txt")
	w.Header().Set("Content-Type", "text/plain")
	parseErr := r.ParseMultipartForm(25*1024*1024)
	if parseErr != nil{
		parseErr.Error()
	}
	mergeStr := r.FormValue("merges")[2:len(r.FormValue("merges"))-2]
	merges := strings.Split(mergeStr,"],[")
	mergeFmt := make([][]int,len(merges))
	for i:=0;i<len(merges);i++{
		tokens := strings.Split(merges[i],",")
		row := make([]int,len(tokens))
		for b:=0;b<len(tokens);b++{
			row[b],_ = strconv.Atoi(tokens[b])
		}
		mergeFmt[i] = row
	}
	files := make([]multipart.File,0)
	var err error
	var file multipart.File
	counter := 0
	for err == nil{
		file,_,err = r.FormFile("file"+strconv.Itoa(counter))
		if err != nil{
			break
		}
		files = append(files,file)
		counter++
	}
	code := randomBase64String(64)
	mergeFiles(files,mergeFmt,code)

	f,_ := os.Open("E:\\Go\\Softsort\\Junk\\"+code+".txt")
	reader := bufio.NewReader(f)
	io.Copy(w, reader)
	end := time.Now()
	fmt.Println(end.Sub(start))
	defer deleteFile("E:\\Go\\Softsort\\Junk\\"+code+".txt")
}

func main() {
	//psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",host,port,user,password,dbname)
	r := mux.NewRouter()
	r.HandleFunc("/query",querySoftSort).Methods("PUT")
	r.HandleFunc("/firstlines",getAllFirstLines).Methods("POST")
	r.HandleFunc("/merge",merge).Methods("POST")
	log.Fatal(http.ListenAndServe(":8081",r))



}
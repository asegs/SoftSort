package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"io"
	"log"
	"net/http"
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
		endIndex := -1
		commaIndexes := make([]int,0)
		firstLine := make([]byte,512)
		for i := 0 ; i<buf.Len();i++{
			b,_ := buf.ReadByte()
			if b!=10 && b!=13{
				if i>len(firstLine){
					firstLine = append(firstLine,b)
				} else{
					firstLine[i] = b
				}
				if b==44{
					commaIndexes = append(commaIndexes,i)
				}
			}else{
				endIndex = i
				break
			}
		}
		line := firstLine[0:endIndex]
		titles = make([]string,len(commaIndexes)+1)
		titles[0] = string(line[0:commaIndexes[0]])
		for i:=0;i<len(commaIndexes)-1;i++{
			titles[i+1] = string(line[commaIndexes[i]:commaIndexes[i+1]])
		}
		titles[len(titles)-1] = string(line[commaIndexes[len(commaIndexes)-1]:len(line)])
	} else{
		titles = strings.Split(r.FormValue("titles"),",")
	}



	auto := AutoSchemaReq{r.FormValue("key"),r.FormValue("name"),headers,r.FormValue("format"),titles,buf}
	fmt.Println(auto)
}

func main() {
	//psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",host,port,user,password,dbname)
	r := mux.NewRouter()
	r.HandleFunc("/query",querySoftSort).Methods("PUT")
	r.HandleFunc("/body",initializeAutoschema).Methods("POST")
	log.Fatal(http.ListenAndServe(":8081",r))



}
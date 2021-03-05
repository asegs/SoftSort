package main

import (
	"bytes"
	"io"
	"mime/multipart"
	"os"
)

func getFirstLine(file multipart.File)[]string{
	buf := bytes.NewBuffer(nil)
	io.Copy(buf, file)
	var titles []string
	endIndex := -1
	commaIndexes := make([]int,0)
	firstLine := make([]byte,512)
	saved := -1
	for i := 0 ; true;i++{
		saved = i
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
	if endIndex==-1{
		endIndex=saved
	}
	line := firstLine[0:endIndex]
	titles = make([]string,len(commaIndexes)+1)
	titles[0] = string(line[0:commaIndexes[0]])
	for i:=0;i<len(commaIndexes)-1;i++{
		titles[i+1] = string(line[commaIndexes[i]+1:commaIndexes[i+1]])
	}
	titles[len(titles)-1] = string(line[commaIndexes[len(commaIndexes)-1]+1:len(line)])
	return titles
}

func deleteFile(filename string){
	e := os.Remove(filename)
	if e != nil {
		e.Error()
	}
}
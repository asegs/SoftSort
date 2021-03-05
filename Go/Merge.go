package main

import (
	"bytes"
	"crypto/rand"
	"encoding/base64"
	"io"
	"math"
	"mime/multipart"
	"strings"
)

func mergeFiles(files []multipart.File,merges [][]int,code string)[][]string{
	grids := make([][][]string,len(files))
	loaded := make([]bool,len(files))
	var sb strings.Builder
	for i:=0;i<len(merges);i++{
		if !loaded[merges[i][0]]{
			keyFile := files[merges[i][0]]
			fmtRows := fileToGrid(keyFile)
			grids[merges[i][0]] = fmtRows
			loaded[merges[i][0]] = true
		}
		file := grids[merges[i][0]]
		keyRow := merges[i][1]
		fillables := make([]string,len(file))
		for b:=0;b<len(fillables);b++{
			fillables[b] = file[b][keyRow]
		}
		lookup := make(map[string][]string)
		if !loaded[merges[i][2]]{
			lockFile := files[merges[i][2]]
			lockRows := fileToGrid(lockFile)
			grids[merges[i][2]] = lockRows
			loaded[merges[i][2]] = true
		}
		lock := grids[merges[i][2]]
		lookupRow := merges[i][3]
		lookupTable := make([]int,len(merges[i])/2-2)
		for b:=5;b<len(merges[i]);b+=2{
			lookupTable[(b-5)/2] = merges[i][b]
		}
		for b:=0;b<len(lock);b++{
			entry := make([]string,len(lookupTable))
			for z:=0;z<len(lookupTable);z++{
				entry[z] = lock[b][lookupTable[z]]
			}
			if b==0{
				lookup[file[0][keyRow]] = entry
			}
			lookup[lock[b][lookupRow]] = entry
		}
		replacement := make([][]string,len(fillables))
		for b:=0;b<len(fillables);b++{
			newLength := len(file[0])-1+len(lookupTable)
			newRow := make([]string,newLength)
			keyColMode := false
			toFill := lookup[fillables[b]]
			for z:=0;z<newLength;z++{
				if z==keyRow{
					keyColMode=true
					newRow[z] = toFill[0]
				}else if z-keyRow>len(toFill)-1{
					keyColMode = false
					if z==newLength-1{
						newRow[z] = strings.ReplaceAll(file[b][z-len(toFill)+1],"\r","")
					}else{
						newRow[z] = file[b][z-len(toFill)+1]
					}
				} else if keyColMode{
					if z-keyRow==len(toFill)-1{
						newRow[z] = strings.ReplaceAll(toFill[z-keyRow],"\r","")
					}else{
						newRow[z] = toFill[z-keyRow]
					}
				}else{
					if z==newLength-1{
						newRow[z] = strings.ReplaceAll(file[b][z],"\r","")
					}else{
						newRow[z] = file[b][z]
					}
				}
			}
			sb.WriteString(strings.Join(newRow,","))
			sb.WriteRune('\n')
			replacement[b] = newRow

		}
		grids[merges[i][0]] = replacement
	}
	var builder strings.Builder
	for i:=0;i<len(grids[merges[0][0]]);i++{
		builder.WriteString(strings.Join(grids[merges[0][0]][i],","))
		builder.WriteRune('\n')
	}
	Write("Junk\\"+code+".txt",builder.String())
	return grids[merges[0][0]]
}

func fileToGrid(file multipart.File)[][]string{
	buf := bytes.NewBuffer(nil)
	io.Copy(buf, file)
	fileString :=buf.String()
	rows := strings.Split(fileString,"\n")
	fmtRows := make([][]string,len(rows))
	lastEmpty := false
	for b:=0;b<len(rows);b++{
		result := strings.Split(rows[b],",")
		if len(result)>1{
			fmtRows[b] = result
		}else{
			lastEmpty = true
		}
	}
	if lastEmpty{
		return fmtRows[0:len(fmtRows)-1]
	}
	return fmtRows
}

func gridToString(grid [][]string)string{
	var sb strings.Builder
	for i:=0;i<len(grid);i++{
		sb.WriteString(strings.Join(grid[i],","))
		sb.WriteRune('\n')
	}
	return sb.String()
}

func randomBase64String(l int) string {
	buff := make([]byte, int(math.Round(float64(l)/float64(1.33333333333))))
	rand.Read(buff)
	str := base64.RawURLEncoding.EncodeToString(buff)
	return str[:l]
}

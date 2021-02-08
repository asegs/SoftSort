package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

func SumFloat64Slice (input []float64) float64{
	val := 0.0
	for i:=0;i<len(input);i++{
		val+=input[i]
	}
	return val
}

func SliceContainsString(searchIn []string, searchFor string) bool {
	for i := 0;i<len(searchIn);i++{
		if searchIn[i]==searchFor{
			return true
		}
	}
	return false
}

func GetIndexOfLargestFloat64InSlice(floats []float64) int{
	index := -1
	largest := 0.0
	for i := 0;i<len(floats);i++{
		if floats[i]>largest{
			largest=floats[i]
			index = i
		}
	}
	return index
}

func GetRowsAndColsCount(company string,topic string) int{
	filename := "C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Data.txt"
	file,_ := os.Open(filename)
	firstByteSlice := make([]byte,12)
	_, _ = file.Read(firstByteSlice)
	var result int
	count := make([]byte,8)
	countStopIdx := -1
	for i := 0;i<len(firstByteSlice);i++{
		c := firstByteSlice[i]
		if c == 10 || c ==13 {
			countStopIdx = i
			break
		}else{
			count[i] = c
		}
	}
	countTxt := string(count[0:countStopIdx])
	result,_ = strconv.Atoi(countTxt)
	return result
}

func GetSchemaTypes(company string,topic string)[]int{
	filename := "C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Schema.txt"
	schema := ReadToString(filename)
	tabs := strings.Split(schema,"\n")
	types := make([]int,0)
	for i := 0;i<len(tabs);i++{
		if len(tabs[i])==0{
			continue
		}
		if tabs[i][0] == '+'{
			if strings.Contains(tabs[i],"<M>"){
				types = append(types,1)
			}else if strings.Contains(tabs[i],"<L>"){
				types = append(types,2)
			}else{
				types = append(types,0)
			}
		}
	}
	return types
}


func ReadData(company string,topic string)[][]string{
	lineCount := GetRowsAndColsCount(company,topic)
	lines := make([][]string,lineCount)
	file := ReadToString("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\" + company + "\\" + topic + "Data.txt")
	tabs := strings.Split(file,"\n")
	for i := 1;i< len(tabs);i++{
		tokens := strings.Split(strings.TrimSpace(tabs[i]),",")
		if len(tokens)<=1{
			continue
		}
		tokens = append(tokens,"")
		lines[i-1] = tokens
	}
	return lines
}
//
//func ReadGeneral(topic string)[][]string{
//
//}

func ReadMinMax(company string,topic string) [][]float64{
	file := ReadToString("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\" + company + "\\" + topic + "Schema.txt")
	tabs := strings.Split(file,"\n")
	result := make([][]float64,0)
	for i:= 0;i<len(tabs)-1;i++{
		if tabs[i][0]=='+'{
			minMax := make([]float64,2)
			if strings.Contains(tabs[i],"<M>"){
				tokens := strings.Split(tabs[i],",")
				min,_ := strconv.ParseFloat(tokens[1],64)
				max,_ := strconv.ParseFloat(tokens[2],64)
				minMax[0] = min
				minMax[1] = max
			}
			result = append(result,minMax)
		}
	}
	return result
}

//return 45.00 with "45" or 45.50 with "45.5"
func betterFormat(num float64) string {
	s := fmt.Sprintf("%.2f", num)
	return strings.TrimRight(strings.TrimRight(s, "0"), ".")
}
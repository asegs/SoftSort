package main

import (
	"fmt"
	"strconv"
	"strings"
)

func softSort(schemaTypes []int,options [][]string,choices [][]string,weights []float64,count int,minMax [][]float64,duplicatesBanned bool) [][]string {
	max := SumFloat64Slice(weights)
	scoredArrays := make([][]string,len(options))
	if count>len(options){
		count = len(options)-1
	}
	selectedArrays := make([][]string,count)
	scores := make([]float64,len(options))
	for b:=0;b<len(options);b++{
		option := options[b]
		if len(option) == 0{
			continue
		}
		runningScore := 0.0
		for i:=0;i<len(schemaTypes);i++{
			if schemaTypes[i]==1{
				expectedLowerValue,_ := strconv.ParseFloat(choices[i][0],64)
				expectedUpperValue,_ := strconv.ParseFloat(choices[i][1],64)
				harshness,_ := strconv.ParseFloat(choices[i][2],64)
				direction,_ := strconv.ParseInt(choices[i][3],10,8)
				actualValue,err := strconv.ParseFloat(strings.TrimSpace(option[i+2]),64)
				if err != nil{
					continue
				}else {
					runningScore += (weights[i]) * GetTargetRangeValueNoDir(actualValue, expectedLowerValue, expectedUpperValue, harshness, int8(direction), minMax[i][0], minMax[i][1])
				}
			}else if schemaTypes[i]==0{
				actual := option[i+2]
				if SliceContainsString(choices[i],actual) {
					runningScore += weights[i]
				}else if choices[i][0]=="<*3"{
					runningScore+=weights[i]
				}
			}else if schemaTypes[i]==2{
				realPair := strings.Split(strings.TrimSpace(option[i+2]),":")
				lat1,_ :=strconv.ParseFloat(realPair[0],64)
				lon1,_ := strconv.ParseFloat(realPair[1],64)
				lat2,_ := strconv.ParseFloat(choices[i][0],64)
				lon2,_ := strconv.ParseFloat(choices[i][1],64)
				toleratedRange,_ := strconv.ParseFloat(choices[i][2],64)
				haversineDist := Haversine(lat1,lon1,lat2,lon2)
				var outsideDist float64
				if haversineDist-toleratedRange>=0{
					outsideDist = haversineDist-toleratedRange
				}else{
					outsideDist = 0
				}
				runningScore+=(weights[i])*getTargetValueNoDir(0,outsideDist,1,false,toleratedRange)

			}
		}
		option[len(option)-1] = fmt.Sprintf("%f",runningScore)
		scoredArrays[b] = option
		scores[b] = runningScore
	}


	noDupesCount := 0

	if !duplicatesBanned{
		for i := 0;i<count;i++{
			index := GetIndexOfLargestFloat64InSlice(scores)
			selectedArrays[i] = scoredArrays[index]
			scores[index] = -1.0
		}
	}else{
		names := make([]string,len(scores))
		for i := 0;i<count;i++{
			index := GetIndexOfLargestFloat64InSlice(scores)
			if !SliceContainsString(names,scoredArrays[index][1]) {
				selectedArrays[i] = scoredArrays[index]
				scores[index] = -1.0
				names[noDupesCount] = scoredArrays[index][1]
				noDupesCount++
			}else{
				i--
				scores[index] = -1.0
			}
		}
	}


	for i := 0;i<len(selectedArrays);i++{
		val,_ := strconv.ParseFloat(selectedArrays[i][len(selectedArrays[i])-1],64)
		selectedArrays[i][len(selectedArrays[i])-1] = betterFormat(val/max*100)+"% match"
	}

	return selectedArrays

}

func softSortOuter(query SortQuery)[][]string{
	schemaTypes := GetSchemaTypes(query.Company,query.Topic)
	options := ReadData(query.Company,query.Topic)
	minMax := ReadMinMax(query.Company,query.Topic)
	return softSort(schemaTypes,options,query.Choices,query.Weights,query.Count,minMax,query.Duplicates)
}
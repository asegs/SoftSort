package main

import "math"

func getTargetValueNoDir(expectedValue float64,actualValue float64,harshness float64,test bool,spread float64) float64{
	standardDev := spread/harshness

	if standardDev<1 && standardDev>-1 { standardDev = 1 }

	if harshness==0 { harshness = 0.1 }

	if test {
		result := 1 / (standardDev*math.Sqrt(2*math.Pi))
		if result==0 { return 0.0001 }
		return result
	}

	firstTerm := 1/(standardDev*math.Sqrt(2*math.Pi))
	secondTerm := -math.Pow(actualValue-expectedValue,2)/(2*math.Pow(standardDev,2))
	multiplier := 1/(getTargetValueNoDir(expectedValue,expectedValue,harshness,true,spread))
	return multiplier*firstTerm*math.Exp(secondTerm)
}

func GetTargetRangeValueNoDir(actualValue float64,lowerBound float64,upperBound float64,harshness float64,direction int8,min float64,max float64) float64{
	if actualValue <= upperBound && actualValue >= lowerBound{ return 1 }

	actualCloserToUpperBound  := math.Abs(actualValue-upperBound) < math.Abs(actualValue-upperBound)
	var result float64
	if actualCloserToUpperBound{
		result = getTargetValueNoDir(upperBound,actualValue,harshness,false,max-min)
	} else {
		result = getTargetValueNoDir(lowerBound,actualValue,harshness,false,max-min)
	}
	if actualCloserToUpperBound && direction==2 {
		return math.Pow(result,harshness)
	} else if direction==1{
		return math.Pow(result,1/harshness)
	}
	return result
}
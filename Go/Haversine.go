package main

import "math"

func toRadians(num float64) float64{
	return (num*math.Pi)/180
}

func Haversine(lat1 float64, lon1 float64, lat2 float64,lon2 float64) float64{
	dLat := toRadians(lat2-lat1)
	dLon := toRadians(lon2-lon1)
	lat1 = toRadians(lat1)
	lat2 = toRadians(lat2)
	a := math.Pow(math.Sin(dLat/2),2)+math.Pow(math.Sin(dLon/2),2)*math.Cos(lat1)*math.Cos(lat2)
	rad := 6371.0
	c := 2 * math.Asin(math.Sqrt(a))
	return rad*c
}

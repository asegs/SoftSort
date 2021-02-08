package utils;

import java.lang.Math;

public class NormalMapper {
    public double getTargetValueNoDir(double expectedValue,double actualValue,double harshness,boolean test,double range){
        double standardDev = range/harshness;

        if (standardDev<1&&standardDev>-1){
            standardDev = 1;
        }
        if (harshness==0){ harshness = 0.1; }
        if (test){
            double result = 1/(standardDev*Math.sqrt(2*Math.PI));
            if (result==0){
                return 0.0001;
            }
            return result;
        }
        double firstTerm = 1/(standardDev*Math.sqrt(2*Math.PI));
        double secondTerm = -Math.pow((actualValue-expectedValue),2)/(2*Math.pow(standardDev,2));
        double multiplier = 1/(getTargetValueNoDir(expectedValue,expectedValue,harshness,true,range));
        return multiplier*firstTerm*Math.exp(secondTerm);
    }

    public double getTargetRangeValueNoDir(double actualValue,double lowerBound,double upperBound,double harshness,int direction,double min,double max){
        if (actualValue<=upperBound&&actualValue>=lowerBound){
            return 1;
        }
        boolean actualCloserToUpperBound = Math.abs(actualValue-upperBound)<Math.abs(actualValue-lowerBound);
        double result = (actualCloserToUpperBound ? getTargetValueNoDir(upperBound,actualValue,harshness,false,max-min) : getTargetValueNoDir(lowerBound,actualValue,harshness,false,max-min));
        if ((actualCloserToUpperBound && direction==2)||(!actualCloserToUpperBound&&direction==1)){
            return Math.pow(result,harshness);
        }
        else if(direction!=3){
            return Math.pow(result,1/harshness);
        }
        return result;
    }
}


package utils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;

public class SoftSortEngine {
    public ArrayList<ArrayList<String>> softSort(ArrayList<Integer> schemaTypes,ArrayList<ArrayList<String>> options, ArrayList<ArrayList<String>> choices, ArrayList<Double> weights,int count,ArrayList<ArrayList<Double>> minMax,boolean duplicates){
        NormalMapper mapper = new NormalMapper();
        Trinkets trinket = new Trinkets();
        QuickSelect qs = new QuickSelect();
        Haversine haversine = new Haversine();
        double max = trinket.sum(weights);
        ArrayList<ArrayList<String>> scoredArrays = new ArrayList<>();
        ArrayList<ArrayList<String>> selectedArrays = new ArrayList<>();
        for (ArrayList<String> option:options){
            double runningScore = 0;
            for (int i=0;i<schemaTypes.size();i++){
                if (schemaTypes.get(i)==1){
                    double expectedLowerValue = Double.parseDouble(choices.get(i).get(0));
                    double expectedUpperValue = Double.parseDouble(choices.get(i).get(1));
                    double harshness = Double.parseDouble(choices.get(i).get(2));
                    int direction = Integer.parseInt(choices.get(i).get(3));
                    double actualValue = Double.parseDouble(option.get(i+2));
                    runningScore+=(weights.get(i))*mapper.getTargetRangeValueNoDir(actualValue,expectedLowerValue,expectedUpperValue,harshness,direction,minMax.get(i).get(0),minMax.get(i).get(1));
                }
                else if (schemaTypes.get(i)==0){
                    String actual = option.get(i+2);
                    if (choices.get(i).contains(actual)){
                        runningScore+=weights.get(i);
                    }
                    else if(choices.get(i).get(0).equals("<*3")){
                        runningScore+=weights.get(i);
                    }
                }
                else if(schemaTypes.get(i)==2){
                    String[] realPair = option.get(i+2).split(":");
                    double haversineDist = haversine.haversine(Double.parseDouble(realPair[0]),Double.parseDouble(realPair[1]),Double.parseDouble(choices.get(i).get(0)),Double.parseDouble(choices.get(i).get(1)));
                    double toleratedRange = Double.parseDouble(choices.get(i).get(2));
                    double outsideDist = haversineDist-toleratedRange>=0 ? haversineDist-toleratedRange : 0;
                    runningScore+=(weights.get(i))*mapper.getTargetValueNoDir(0,outsideDist,1,false,toleratedRange);
                }
            }
            option.add(String.valueOf(runningScore));
            scoredArrays.add(option);
        }
        Double[] scores = trinket.scoredArrListsToIntArr(scoredArrays);
        if (count>scoredArrays.size()){
            count = scoredArrays.size();
        }
        if (!duplicates) {
            System.out.println("Duplicates allowed");
            for (int i = 0; i < count; i++) {
                int index = qs.getIndexOfLargest(scores);
                selectedArrays.add(scoredArrays.get(index));
                scores[index] = -1.0;
            }
        }
        else{
            System.out.println("Duplicates not allowed");
            ArrayList<String> names = new ArrayList<>();
            for (int i = 0; i < count; i++) {
                int index = qs.getIndexOfLargest(scores);
                if (!names.contains(scoredArrays.get(index).get(1))){
                    selectedArrays.add(scoredArrays.get(index));
                    scores[index] = -1.0;
                    names.add(scoredArrays.get(index).get(1));
                }
                else{
                    i--;
                    scores[index] = -1.0;
                }
            }
        }

        for (int i=0;i<selectedArrays.size();i++){
            double val =  Double.parseDouble(selectedArrays.get(i).get(selectedArrays.get(i).size()-1));
            selectedArrays.get(i).remove(selectedArrays.get(i).size()-1);
            double preNumber = ((int)(val/max*1000));
            double number = preNumber/10;

            selectedArrays.get(i).add(number+"% match");
        }

        return selectedArrays;
    }
    public ArrayList<ArrayList<String>> softSortOuter(String company,String topic,ArrayList<ArrayList<String>> choices, ArrayList<Double> weights,int count,ArrayList<ArrayList<Double>> minMax,boolean duplicates){
        Trinkets trinket = new Trinkets();
        DataReader dataReader = new DataReader();
        ArrayList<Integer> schemaTypes = trinket.schemaTypes(company,topic);
        ArrayList<ArrayList<String>> options;
        if (company.equals("General")){
            options = dataReader.getGeneralData(topic);
        }
        else{
            options = dataReader.getData(company,topic);
        }
        return softSort(schemaTypes,options,choices,weights,count,minMax,duplicates);
    }
}


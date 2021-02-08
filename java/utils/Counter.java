package utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;

public class Counter {
    FileReader fr = new FileReader();
    GeneralHandler generalHandler = new GeneralHandler();
    public ArrayList<Boolean> getNumerics(String company,String topic){
        String schemaFile = fr.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Schema.txt");
        String[] schemaArr = schemaFile.split("\n");
        ArrayList<Boolean> isNumeric = new ArrayList<>();
        for (String schema:schemaArr){
            if (schema.charAt(0)=='+'){
                if (schema.contains("<M>")){
                    isNumeric.add(true);
                }
                else{
                    isNumeric.add(false);
                }
            }
        }
        return isNumeric;
    }

    public ArrayList<Boolean> getGeneralNumerics(String topic){
        ArrayList<String> names = generalHandler.getGeneralSchemaTopic(topic);
        ArrayList<Boolean> result = new ArrayList<>();
        for (String str:names){
            if (str.contains("<M>")) {
                result.add(true);
            } else {
                result.add(false);
            }
        }
        return result;
    }

    public ArrayList<ArrayList<Integer>> generalCountToMap(String topic,String company){
        ArrayList<HashMap<String,Integer>> result = new ArrayList<>();
        String dataFile = fr.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"General.txt");
        ArrayList<String> schema = generalHandler.getGeneralSchemaTopic(topic);
        ArrayList<Boolean> isCountable = new ArrayList<>();
        for (String str:schema){
            if (!str.contains("<M>")&&!str.contains("<L>")){
                isCountable.add(true);
            }
            else{
                isCountable.add(false);
            }
            result.add(new HashMap<>());
        }
        for (String line:dataFile.split("\n")){
            String[] tokens = line.split(",");
            for (int i=2;i<tokens.length;i++){
                if (isCountable.get(i-2)){
                    try{
                        result.get(i-2).put(tokens[i],result.get(i-2).get(tokens[i])+1);
                    }
                    catch (Exception e){
                        result.get(i-2).put(tokens[i],1);
                    }
                }
            }
        }
        ArrayList<ArrayList<Integer>> formattedResult = new ArrayList<>();
        int topCounter = 0;
        for (HashMap<String,Integer> hm:result){
            formattedResult.add(new ArrayList<>());
            for (String name: hm.keySet()){
                formattedResult.get(topCounter).add(hm.get(name));
            }
            topCounter++;
        }
        return formattedResult;

    }

    public ArrayList<ArrayList<Integer>> countToMap(String company,String topic,boolean general){
        ArrayList<HashMap<String,Integer>> result = new ArrayList<>();
        String schemaFile;
        String dataFile;
        if (general){
            return generalCountToMap(topic,company);
        }
        else{
            schemaFile = fr.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Schema.txt");
            dataFile = fr.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Data.txt");
        }
        for (int i = 0; i<schemaFile.split("\\+").length-1; i++){
            result.add(new HashMap<>());
        }
        String[] schemaArr = schemaFile.split("\n");
        ArrayList<Integer> isNumeric = new ArrayList<>();
        int counter = -1;
        for (String schema:schemaArr){
            if (schema.charAt(0)=='+'){
                counter++;
                if (schema.contains("<M>")){
                    isNumeric.add(1);
                }
                else if (schema.contains("<L>")){
                    isNumeric.add(2);
                }
                else{
                    isNumeric.add(0);
                }
            }
            else if(schema.charAt(0)=='-'){
                int commaIndex = !schema.contains(",") ? schema.length() : schema.indexOf(",");
                result.get(counter).put(schema.substring(1,commaIndex),0);
            }
        }
        String[] lines = dataFile.split("\n");
        for (String line:lines){
            if (!line.contains(",")){
                continue;
            }
            String[] tokens = line.split(",");
            for (int i=0;i<isNumeric.size();i++){
                if (isNumeric.get(i)==0){
                    String token = tokens[i+2];
                    result.get(i).put(token,result.get(i).get(token)+1);
                    //result.get(i).put(tokens[i+2].substring(1),result.get(i).get(tokens[i+2].substring(1))+1);
                }
            }
        }
        ArrayList<ArrayList<Integer>> formattedResult = new ArrayList<>();
        int topCounter = 0;
        for (HashMap<String,Integer> hm:result){
            formattedResult.add(new ArrayList<>());
            for (String name: hm.keySet()){
                formattedResult.get(topCounter).add(hm.get(name));
            }
            topCounter++;
        }
        return formattedResult;
    }

    public ArrayList<ArrayList<Double>> getMinMaxFromData(String company,String topic,boolean general){
        ArrayList<Boolean> numerics;
        ArrayList<ArrayList<Double>> result = new ArrayList<>();
        String dataFile;
        if (general){
            dataFile = fr.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\" + company + "\\" + topic + "General.txt");
            numerics = getGeneralNumerics(topic);
        }
        else {
            dataFile = fr.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\" + company + "\\" + topic + "Data.txt");
            numerics = getNumerics(company,topic);
        }
        String[] lines = dataFile.split("\n");
        int size = lines[1].split(",").length-2;
        for (int i=0;i<size;i++){
            if (numerics.get(i)) {
                ArrayList<Double> prefab = new ArrayList<>();
                prefab.add(Double.MAX_VALUE);
                prefab.add(Double.MIN_VALUE);
                result.add(prefab);
            }
            else {
                result.add(new ArrayList<>());
            }
        }
        for (String str:lines){
            String[] items = str.split(",");
            for (int i=2;i<items.length;i++){
                if (numerics.get(i-2)){
                    double value;
                    try {
                        value = Double.parseDouble(items[i]);
                    }
                    catch (NumberFormatException nfe){
                        continue;
                    }
                    if (result.get(i-2).get(0)>value){
                        result.get(i-2).set(0,value);
                    }
                    if (result.get(i-2).get(1)<value){
                        result.get(i-2).set(1,value);
                    }
                }
            }

        }
        return result;
    }

    public boolean countToFile(String topic,String company){
        ArrayList<ArrayList<Integer>> nums = countToMap(company,topic,false);
        String toWrite = "";
        for (ArrayList<Integer> row:nums){
            if (row.size()==0){
                toWrite+="+\n";
            }
            else{
                toWrite+="+\n";
                for (Integer i:row){
                    toWrite+="-"+i+"\n";
                }
            }
        }
        WriteToFile writeToFile = new WriteToFile();
        writeToFile.write("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Count.txt",toWrite);
        return true;
    }

    public ArrayList<ArrayList<Integer>> readFromCount(String company,String topic){
        FileReader reader = new FileReader();
        String count = reader.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Count.txt");
        String[] lines = count.split("\n");
        ArrayList<ArrayList<Integer>> result = new ArrayList<>();
        ArrayList<Integer> current = null;
        for (String entry:lines){
            if (entry.equals("+")){
                if (!(current ==null)){
                    result.add(current);
                }
                current = new ArrayList<>();
            }
            else{
                current.add(Integer.parseInt(entry.substring(1)));
            }
        }
    return result;
    }

    public void minMaxToFile(String company,String topic){
        ArrayList<ArrayList<Double>> result = getMinMaxFromData(company,topic,false);
        String toWrite = "";
        WriteToFile writeToFile = new WriteToFile();
        for (ArrayList<Double> dubs:result){
            if (dubs.size()==0){
                toWrite+="+\n";
            }
            else{
                toWrite+="+"+dubs.get(0)+","+dubs.get(1)+"\n";
            }
        }
        writeToFile.write("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"MinMax.txt",toWrite);
    }

    public ArrayList<ArrayList<Double>> getMinMaxFromFile(String company,String topic){
        FileReader reader = new FileReader();
        String count = reader.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"MinMax.txt");
        String[] lines = count.split("\n");
        ArrayList<ArrayList<Double>> result = new ArrayList<>();
        for (String line:lines){
            if (line.length()==1){
                result.add(new ArrayList<>());
            }
            else if(line.length()>1){
                String[] tokens = line.substring(1).split(",");
                ArrayList<Double> tempArr = new ArrayList<>();
                tempArr.add(Double.parseDouble(tokens[0]));
                tempArr.add(Double.parseDouble(tokens[1]));
                result.add(tempArr);
            }
        }
        return result;
    }
}

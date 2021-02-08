package utils;

import objects.JSON;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class Trinkets {
    FileReader fr = new FileReader();
    public double sum(ArrayList<Double> target){
        double num = 0;
        for (Double item:target){
            num+=item;
        }
        return num;
    }

    public ArrayList<Boolean> schemaNumeric(ArrayList<ArrayList<String>> schema){
        ArrayList<Boolean> isNumeric = new ArrayList<>();
        for (ArrayList<String> element:schema) {
            if (element==null){
                isNumeric.add(true);
            }
            else {
                isNumeric.add(false);
            }
        }
        return isNumeric;
        }

        public ArrayList<Integer> schemaTypes(String company,String topic){
            ArrayList<Integer> result = new ArrayList<>();
            String file = fr.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Schema.txt");
            String[] lines = file.split("\n");
            for (String str:lines){
                if (str.charAt(0)!='+'){
                    continue;
                }
                if (str.contains("<M>")){
                    result.add(1);
                }
                else if (str.contains("<L>")){
                    result.add(2);
                }
                else{
                    result.add(0);
                }
            }
            return result;
        }
    public double timePredictor(int rows,int columns){
        return 0.0000675*rows*columns;
    }

    public String getValueOfJSONKey(ArrayList<JSON> jsonArray,String key){
        for (int i=0;i<jsonArray.size();i++){
            if (jsonArray.get(i).getTitle().equals(key)){
                return jsonArray.get(i).getBody();
            }
        }
        return "";
    }

    public ArrayList<Double> stringToDoublesArray(String values){
        ArrayList<Double> doubles = new ArrayList<>();
        String[] valueArr = values.split(",");
        for (String val:valueArr){
            doubles.add(Double.parseDouble(val));
        }
        return doubles;
    }

    public ArrayList<ArrayList<String>> choiceSetter(String choices){
        //Have to split on <M> tags as well as [] tags!!

        ArrayList<ArrayList<String>> picks = new ArrayList<>();
        while (choices.contains("[")||choices.contains("<M>")||choices.contains("<L>")){
            ArrayList<String> newArr = new ArrayList<>();
            int endIndex = 0;
            if (choices.charAt(0)=='['){
                endIndex = choices.indexOf(']');
                String choice = choices.substring(1,endIndex);
                String[] selected = choice.split(",");
                newArr.addAll(Arrays.asList(selected));
                endIndex+=2;

            }
            else if(choices.charAt(1)=='M'){
                endIndex = choices.indexOf("<M>",3);
                String choice = choices.substring(3,endIndex);
                String[] choiceSplit = choice.split("n");
                newArr.addAll(Arrays.asList(choiceSplit));
                endIndex+=4;

            }
            else if (choices.charAt(1)=='L'){
                endIndex = choices.indexOf("<L>",3);
                String choice = choices.substring(3,endIndex);
                String[] choiceSplit = choice.split(":");
                newArr.addAll(Arrays.asList(choiceSplit));
                endIndex+=4;
            }
            try {
                choices = choices.substring(endIndex);
            }
            catch (Exception e){
                choices = "";
            }
            picks.add(newArr);
        }
//        for (String choice:choiceArr){
//            ArrayList<String> newArr = new ArrayList<>();
//            if (choice.contains("<M>")){
//                choice = choice.replaceAll("<M>","");
//                String[] choiceSplit = choice.split("n");
//                newArr.addAll(Arrays.asList(choiceSplit));
//            }
//            else {
//                String[] selected = choice.split(",");
//                newArr.addAll(Arrays.asList(selected));
//            }
//            picks.add(newArr);
//        }
        return picks;
    }

    public Double[] scoredArrListsToIntArr(ArrayList<ArrayList<String>> array){
        ArrayList<Double> nums = new ArrayList<>();
        for (ArrayList<String> subArr:array){
            nums.add(Double.parseDouble(subArr.get(subArr.size()-1)));
        }
        Double[] arr = new Double[nums.size()];
        return nums.toArray(arr);
    }

    public String getFromJSONRequest(String json,String key){
        json = json.substring(json.indexOf("Content-Disposition: form-data; name=\""+key+"\""),json.indexOf("---",json.indexOf("Content-Disposition: form-data; name=\""+key+"\"")+1));
        String[] jsonArr = json.substring(json.indexOf("\n")).split("\n");
        for (String str:jsonArr){
            if (str.trim().length()>0){
                return str;
            }
        }
        return "";
    }

    public int getIndexOfFirstReturn(String body){
        int nl = body.indexOf("\n");
        int cr = body.indexOf("\r");
        int both = body.indexOf("\r\n");
        if (nl<cr&&nl<both){
            return nl;
        }
        else if(cr<nl&&cr<both){
            return cr;
        }
        else{
            return both;
        }
    }

    public int getNthIndex(String searchIn,String regex,int n){
        try {
            int chopped = 0;
            for (int i=0;i<n;i++){
                chopped += searchIn.indexOf(regex)+regex.length();
                searchIn = searchIn.substring(searchIn.indexOf(regex)+regex.length());
            }
            return !searchIn.contains(regex) ? -1 : searchIn.indexOf(regex)+chopped;
        }
        catch (Exception e){
            return -1;
        }

    }

    public int getIndexOfOrEnd(String searchIn,String regex){
        int pos = searchIn.indexOf(regex);
        return pos==-1 ? searchIn.length() : pos;
    }

    public HashMap<String,HashMap<String,String>> commentsToMap(String company,String topic){
        HashMap<String,HashMap<String,String>> oldComments = new HashMap<>();
        File oldSchema = new File("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\" + company + "\\" + topic + "Schema.txt");
        if (oldSchema.exists()){
            String oldText = fr.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\" + company + "\\" + topic + "Schema.txt");
            String[] rows = oldText.split("\n");
            String name = "";
            for (String row:rows){
                if (row.charAt(0)=='+'&&!row.contains("<M>")&&!row.contains("<L>")){
                    name = row.substring(1,getIndexOfOrEnd(row,","));
                    oldComments.put(name,new HashMap<>());
                }
                else if(row.charAt(0)=='-'){
                    int commentStartIndex = getNthIndex(row,",",1);
                    if (commentStartIndex!=-1){
                        oldComments.get(name).put(row.substring(1,getIndexOfOrEnd(row,",")),row.substring(commentStartIndex+1));
                    }
                }
            }
        }
        return oldComments;
    }

    public HashMap<String,String> getNameComments(String company,String topic){
        HashMap<String,String> oldComments = new HashMap<>();
        File oldSchema = new File("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\" + company + "\\" + topic + "Schema.txt");
        if (oldSchema.exists()){
            String oldText = fr.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\" + company + "\\" + topic + "Schema.txt");
            String[] rows = oldText.split("\n");
            for (String row:rows){
                if (row.charAt(0)=='+'){
                    String name = row.substring(1,getIndexOfOrEnd(row,","));
                    if (row.contains("<M>")){
                        int commentStartIndex = getNthIndex(row,",",2);
                        if (commentStartIndex!=-1){
                            oldComments.put(name,row.substring(commentStartIndex+1));
                        }
                    }
                    else{
                        int commentStartIndex = row.indexOf(",");
                        if (commentStartIndex!=-1){
                            oldComments.put(name,row.substring(commentStartIndex+1));
                        }
                    }

                }
            }
        }
        return oldComments;
    }

    public String getOldURL(String company,String topic){
        String url = "";
        File oldSchema = new File("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\" + company + "\\" + topic + "Schema.txt");
        if (oldSchema.exists()){
            String oldText = fr.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\" + company + "\\" + topic + "Schema.txt");
            String[] rows = oldText.split("\n");
            for (String row:rows){
                if (row.charAt(0)=='#'&&row.contains("<I>")){
                    url = row.substring(1);
                }
            }
        }
        return url;
    }

}

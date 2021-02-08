package utils;

import objects.Math;
import objects.Schema;
import objects.Subtitle;
import objects.Title;

import java.util.ArrayList;
import java.util.HashMap;

public class SchemaReader {
    Trinkets trinkets = new Trinkets();
    public ArrayList<ArrayList<String>> parseSchemaFile(String company,String topic){
        FileReader fileReader = new FileReader();
        String filename = "C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Schema.txt";
        String schema = fileReader.read(filename);
        String[] tabs = schema.split("\n");
        ArrayList<ArrayList<String>> cats = new ArrayList<>();
        String currentPlace = "";
        for (String tab:tabs){
            if (tab.charAt(0)=='+'){
                currentPlace = tab.substring(1);
                if (currentPlace.contains("<M>")){
                    cats.add(null);
                }
                else {
                    cats.add( new ArrayList<>());
                }
            }
            else if (tab.charAt(0)=='-'){
                cats.get(cats.size()-1).add(tab.substring(1,tab.indexOf(",")));
            }
        }
        return cats;
    }

    public ArrayList<ArrayList<String>> parseSchemaFileWithCats(String company,String topic){
        FileReader fileReader = new FileReader();
        String filename = "C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Schema.txt";
        String schema = fileReader.read(filename);
        String[] tabs = schema.split("\n");
        ArrayList<String> catNames = new ArrayList<>();
        ArrayList<ArrayList<String>> cats = new ArrayList<>();
        String currentPlace = "";
        for (String tab:tabs){
            if (tab.charAt(0)=='+'){
                currentPlace = tab.substring(1);
                if (!currentPlace.contains("<M>")&&!currentPlace.contains("<L>")){
                    cats.add(new ArrayList<>());
                    int commaIndex = currentPlace.indexOf(",");
                    if (commaIndex==-1){
                        commaIndex = currentPlace.length();
                    }
                    catNames.add(currentPlace.substring(0,commaIndex));
                }
                else{
                    int commaIndex = currentPlace.indexOf(",");
                    if (commaIndex==-1){
                        commaIndex = currentPlace.length();
                    }
                    catNames.add(currentPlace.substring(0,commaIndex));
                }
            }
            else if(tab.charAt(0)=='-'){
                cats.get(cats.size()-1).add(tab.substring(1,tab.indexOf(",")));
            }
        }
        cats.add(catNames);
        return cats;
    }

    public ArrayList<ArrayList<Integer>> getCountFromSchema(String company,String topic){
        FileReader fileReader = new FileReader();
        ArrayList<ArrayList<Integer>> result = new ArrayList<>();
        String filename = "C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Schema.txt";
        String schema = fileReader.read(filename);
        String[] tabs = schema.split("\n");
        ArrayList<Integer> count = null;
        for (String row:tabs){
            if (row.charAt(0)=='+'){
                if (count!=null){
                    result.add(count);
                }
                count = new ArrayList<>();
            }
            else if(row.charAt(0)=='-'){
                count.add(Integer.parseInt(row.split(",")[1]));
            }
        }
        result.add(count);
        return result;
    }

    public ArrayList<ArrayList<Double>> getMinMaxFromSchema(String company,String topic){
        FileReader fileReader = new FileReader();
        ArrayList<ArrayList<Double>> result = new ArrayList<>();
        String filename = "C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Schema.txt";
        String schema = fileReader.read(filename);
        String[] tabs = schema.split("\n");
        ArrayList<Double> count = null;
        for (String row:tabs){
            if (row.charAt(0)=='+'){
                count = new ArrayList<>();
                if (row.contains("<M>")){
                    String[] tokens = row.split(",");
                    count.add(Double.parseDouble(tokens[1]));
                    count.add(Double.parseDouble(tokens[2]));
                }
                result.add(count);
            }
        }
        return result;
    }

    public ArrayList<ArrayList<String>> getCommentsFromSchema(String company,String topic){
        FileReader fileReader = new FileReader();
        ArrayList<ArrayList<String>> result = new ArrayList<>();
        String filename = "C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Schema.txt";
        String schema = fileReader.read(filename);
        String[] rows = schema.split("\n");
        ArrayList<String> mainDescs = new ArrayList<>();
        ArrayList<String> lines = null;
        for (String row:rows){
            if (row.charAt(0)=='+'){
                if (lines!=null){
                    if (lines.size()==0){
                        lines.add("");
                    }
                    result.add(lines);
                }
                lines = new ArrayList<>();
                if (row.contains("<M>")){
                    try {
                        mainDescs.add(row.split(",")[3]);
                    }
                    catch (IndexOutOfBoundsException e){
                        mainDescs.add("");
                    }

                }
                else{
                    try {
                        mainDescs.add(row.split(",")[1]);
                    }
                    catch (IndexOutOfBoundsException e){
                        mainDescs.add("");
                    }
                }
            }
            else if (row.charAt(0)=='-'){
                try {
                    lines.add(row.split(",")[2]);
                }
                catch (IndexOutOfBoundsException e){
                    lines.add("");
                }
            }

        }
        if (lines.size()==0){
            lines.add("");
        }
        result.add(lines);
        result.add(mainDescs);
        return result;
    }

    public String getUrlString(String company,String topic){
        FileReader fileReader = new FileReader();
        String filename = "C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Schema.txt";
        String schema = fileReader.read(filename);
        schema = schema.substring(schema.indexOf("#")+1,schema.indexOf("\n",schema.indexOf("#")+1));
        return schema;
    }

    public ArrayList<ArrayList<String>> getCommentsFromFile(String company,String topic){
        ArrayList<ArrayList<String>> result = new ArrayList<>();
        ArrayList<String> nameComments = new ArrayList<>();
        FileReader fileReader = new FileReader();
        String filename = "C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Schema.txt";
        String schema = fileReader.read(filename);
        String[] tabs = schema.split("\n");
        ArrayList<String> attrs = null;
        for (String tab:tabs){
            if (tab.charAt(0)=='+'){
                if (attrs!=null){
                    result.add(attrs);
                }
                attrs = new ArrayList<>();
                if (tab.contains("<M>")){
                    int commentIndex = trinkets.getNthIndex(tab,",",2);
                    nameComments.add(commentIndex!=-1 ? tab.substring(commentIndex+1) : "");
                }
                else {
                    int commentIndex = tab.indexOf(",");
                    nameComments.add(commentIndex!=-1 ? tab.substring(commentIndex+1) : "");
                }
            }
            else if (tab.charAt(0)=='-'){
                int commentIndex = trinkets.getNthIndex(tab,",",1);
                attrs.add(commentIndex!=-1 ? tab.substring(commentIndex+1) : "");
            }
        }
        result.add(attrs);
        result.add(nameComments);
        return result;
    }


}

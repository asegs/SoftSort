package utils;

import javax.validation.constraints.Null;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;

public class SchemaEditor {
    FileReader reader = new FileReader();
    WriteToFile writer = new WriteToFile();
    Counter counter = new Counter();
    Trinkets trinkets = new Trinkets();
    private void combineCountWithSchema(ArrayList<ArrayList<Integer>> count,String company,String topic){
        String toWrite = "";
        String schema = reader.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Schema.txt");
        String[] tabs = schema.split("\n");
        int counter = -1;
        int lines = 0;
        for (String row:tabs){
            if (row.charAt(0)=='+'){
                counter++;
                lines = 0;
                toWrite+=row+"\n";
            }
            else if (row.charAt(0)=='-'){
                int index = !row.contains(",") ? row.length() : row.indexOf(",");
                toWrite+=row.substring(0,index)+","+count.get(counter).get(lines)+"\n";
                lines++;
            }
            else {
                toWrite+=row+"\n";
            }
        }
        writer.write("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Schema.txt",toWrite);
    }

    private void combineMinMaxWithSchema(ArrayList<ArrayList<Double>> minMax,String company,String topic){
        String toWrite = "";
        String schema = reader.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Schema.txt");
        String[] tabs = schema.split("\n");
        int counter = -1;
        for (String row:tabs){
            if (row.charAt(0)=='+'){
                counter++;
                if (row.contains("<M>")){
                    if (!row.endsWith("<M>")){
                        row = row.substring(0,row.indexOf("<M>")+3);
                    }
                    toWrite+=row+","+ Collections.min(minMax.get(counter))+","+Collections.max(minMax.get(counter))+"\n";
                }
                else {
                    toWrite+=row+"\n";
                }
            }
            else {
                toWrite+=row+"\n";
            }
        }
        writer.write("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Schema.txt",toWrite);
    }

    public void appendCommentsToSchema(String company, String topic, ArrayList<ArrayList<String>> comments){
        String toWrite = "";
        String schema = reader.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Schema.txt");
        String[] tabs = schema.split("\n");
        int nameCount = 0;
        int attrCount = 0;

        ArrayList<String> nameComments = comments.remove(comments.size()-1);
        for (String tab:tabs){
            if (tab.charAt(0)=='+'){
                String comment = nameComments.get(nameCount);
                comment = comment.replaceAll("\"","");
                comment = comment.replaceAll("\\\\","");
                if (tab.contains("<M>")){
                    int insertIndex = trinkets.getNthIndex(tab,",",2);
                    if (comment.equals("")&&insertIndex!=-1){
                        toWrite+=tab.substring(0,insertIndex)+'\n';
                    }
                    else if(comment.equals("")){
                        toWrite+=tab+'\n';
                    }
                    else if (insertIndex!=-1){
                        toWrite+=tab.substring(0,insertIndex+1)+comment+'\n';
                    }
                    else{
                        toWrite+=tab+","+comment+'\n';
                    }
                }
                else{
                    int insertIndex = tab.indexOf(",");
                    if (comment.equals("")&&insertIndex!=-1){
                        toWrite+=tab.substring(0,insertIndex)+'\n';
                    }
                    else if (comment.equals("")){
                        toWrite+=tab+'\n';
                    }
                    else if (insertIndex!=-1){
                        toWrite+=tab.substring(0,insertIndex+1)+comment+'\n';
                    }
                    else{
                        toWrite+=tab+","+comment+'\n';
                    }
                }
                nameCount++;
                attrCount = 0;
            }
            else if(tab.charAt(0)=='-'){
                String comment = comments.get(nameCount-1).get(attrCount);
                comment = comment.replaceAll("\"","");
                int insertIndex = trinkets.getNthIndex(tab,",",1);
                if (comment.equals("")&&insertIndex!=-1){
                    toWrite+=tab.substring(0,insertIndex)+'\n';
                }
                else if (comment.equals("")){
                    toWrite+=tab+'\n';
                }
                else if (insertIndex!=-1){
                    toWrite+=tab.substring(0,insertIndex+1)+comment+'\n';
                }
                else{
                    toWrite+=tab+","+comment+'\n';
                }
                attrCount++;
            }
            else{
                toWrite+=tab+'\n';
            }
        }
        writer.write("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Schema.txt",toWrite);
    }

    public void loadCommentsFromMaps(String company, String topic, HashMap<String,HashMap<String,String>> attrComments,HashMap<String,String> nameComments){
        String toWrite = "";
        String schema = reader.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Schema.txt");
        String[] tabs = schema.split("\n");
        String colName = "";
        for (String row:tabs){
            if (row.charAt(0)=='+'){
                colName = row.substring(1,trinkets.getIndexOfOrEnd(row,","));
                String comment = nameComments.get(colName);
                if (comment!=null){
                    toWrite+=row+","+comment+'\n';
                }
                else{
                    toWrite+=row+'\n';
                }
            }
            else if(row.charAt(0)=='-'){
                String itemName = row.substring(1,trinkets.getIndexOfOrEnd(row,","));
                String comment = attrComments.get(colName).get(itemName);
                if (comment!=null){
                    toWrite+=row+','+comment+'\n';
                }
                else{
                    toWrite+=row+'\n';
                }
            }
            else{
                toWrite+=row+'\n';
            }
        }
    writer.write("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Schema.txt",toWrite);

    }

    public void detailSchema(String company,String topic){
        ArrayList<ArrayList<Integer>> count = counter.countToMap(company,topic,false);
        ArrayList<ArrayList<Double>> minMax = counter.getMinMaxFromData(company,topic,false);
        combineCountWithSchema(count,company,topic);
        combineMinMaxWithSchema(minMax,company,topic);
    }

    public void genericDetailSchema(String company,String topic,ArrayList<ArrayList<Integer>> count,ArrayList<ArrayList<Double>> minMax){
        combineCountWithSchema(count,company,topic);
        combineMinMaxWithSchema(minMax,company,topic);
    }



}

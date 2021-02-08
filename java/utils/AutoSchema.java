package utils;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;

public class AutoSchema {
    CompanyEditor companyEditor = new CompanyEditor();
    Trinkets trinkets = new Trinkets();
    WriteToFile write = new WriteToFile();
    SchemaEditor schemaEditor = new SchemaEditor();
    HttpReqMaker reqMaker = new HttpReqMaker();
    public boolean generateSchema(String company,String topic,String file,ArrayList<String> titles,String format) throws IOException, InterruptedException {
        topic = topic.replaceAll(
                "[^a-zA-Z0-9]", "");
        FileReader fr = new FileReader();
        ArrayList<HashSet<String>> inFile = new ArrayList<>();
        ArrayList<Integer> intsUsedForLoc = new ArrayList<>();
        ArrayList<Integer> locMergeIndexes = new ArrayList<>();
        String[] lines = file.split("\n");
        int resultsFound = 2;
        int locNumber = 1;
        while (resultsFound==2){
            resultsFound = 0;
            int[] pair = new int[2];
            for (int i=0;i<titles.size();i++){
                if (titles.get(i).contains("<LA"+locNumber+">")){
                    resultsFound++;
                    pair[0] = i;
                }
                else if(titles.get(i).contains("<LO"+locNumber+">")){
                    resultsFound++;
                    pair[1] = i;
                }
            }
            if (resultsFound==2){
                locMergeIndexes.add(pair[0]);
                locMergeIndexes.add(pair[1]);
                locNumber++;
            }
        }
        StringBuilder newData = new StringBuilder();
        reqMaker.setSize(company,topic,false,lines.length);
        for (String str:lines){
            if (str.trim().length()==0){
                continue;
            }
            String[] tokens = str.split(",");
            if (inFile.size()==0){
                for (String size:tokens){
                    inFile.add(new HashSet<>());
                }
            }
            StringBuilder locLine = new StringBuilder();
            locLine.append(tokens[0]).append(",").append(tokens[1]).append(",");
            int locPos = 0;
            for (int i=2;i<tokens.length;i++){
                int locIndex = locMergeIndexes.indexOf(i-2);
                if (locIndex%2!=0&&locIndex!=-1){
                    locLine.append(tokens[locMergeIndexes.get(locPos)+2]).append(":").append(tokens[locMergeIndexes.get(locPos+1)+2]).append(",");
                    locPos+=2;
                }
                if (locIndex==-1){
                    locLine.append(tokens[i]).append(",");
                }
                inFile.get(i-2).add(tokens[i]);
            }
            newData.append(locLine.substring(0,locLine.toString().length()-1)).append("\n");
        }
        String toWrite = "";
        int counter = 0;

        for (String str:titles){
            if (str.contains("<L")){
                int lastVal = str.charAt(str.indexOf(">")-1);
                if (!intsUsedForLoc.contains(lastVal)){
                    toWrite+= "+"+str.substring(0,str.indexOf("<"))+"<L>\n";
                    intsUsedForLoc.add(lastVal);
                }
            }
            else {
                toWrite += "+" + str + "\n";
            }
            if (!str.contains("<M>")&&!str.contains("<L")){
                for (String surname:inFile.get(counter)){
                    toWrite+="-"+surname+"\n";
                }
            }
            counter++;
        }

        if (!format.contains("<I>")){
            String oldFormat = trinkets.getOldURL(company,topic);
            if (oldFormat.contains("<I>")){
                format = oldFormat;
            }
        }

        if (format.length()>0){
            toWrite+="#"+format+"\n";
        }



        if (!company.equals("")) {
            String all = lines.length+"\n"+newData.toString();
            HashMap<String,HashMap<String,String>> attrComments = trinkets.commentsToMap(company,topic);
            HashMap<String,String> nameComments = trinkets.getNameComments(company,topic);
            write.write("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\" + company + "\\" + topic + "Schema.txt", toWrite);
            write.write("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\" + company + "\\" + topic + "Data.txt",all);
            schemaEditor.detailSchema(company,topic);
            schemaEditor.loadCommentsFromMaps(company,topic,attrComments,nameComments);
        }
        else{
            System.out.println("Invalid key!");
            return false;
        }
    return true;
    }

    public ArrayList<HashSet<String>> getHashSetFromData(ArrayList<HashSet<String>> starter, String file,ArrayList<Boolean> numerics){
        String[] lines = file.split("\n");
        for (String str:lines){
            if (str.trim().length()==0){
                continue;
            }
            String[] tokens = str.split(",");
            for (int i=2;i<tokens.length;i++){
                if (!numerics.get(i-2)) {
                    starter.get(i - 2).add(tokens[i]);
                }
            }
        }
        return starter;
    }

    public ArrayList<String> getRequiredTitles(String file){
        file = file.substring(0,file.indexOf('\n'));
        String[] tokens = file.split(",");
        ArrayList<String> examples = new ArrayList<>();
        for (int i=2;i<tokens.length;i++){
            examples.add(tokens[i]);
        }
        return examples;
    }

    public boolean initialParser(String json) throws IOException, InterruptedException {
        String key = trinkets.getFromJSONRequest(json,"key");
        String name = trinkets.getFromJSONRequest(json,"name").trim();
        name = name.replaceAll(
                "[^a-zA-Z0-9]", "");
        boolean headers = Boolean.parseBoolean(trinkets.getFromJSONRequest(json,"headers").trim());
        String format = trinkets.getFromJSONRequest(json,"format").trim();
        String company = companyEditor.getCompForKey(key.trim());
        for (int i=0;i<8;i++){
            json = json.substring(trinkets.getIndexOfFirstReturn(json)+1);
        }
        String file = json.substring(0,json.indexOf("---"));
        ArrayList<String> titleArr = new ArrayList<>();
        if (headers){
            String titles = file.substring(0,trinkets.getIndexOfFirstReturn(file));
            file = file.substring(trinkets.getIndexOfFirstReturn(file)+2);
            String[]  parsed = titles.split(",");
            parsed = Arrays.copyOfRange(parsed, 2, parsed.length);
            titleArr = new ArrayList<>(Arrays.asList(parsed));
        }
        else {
            String cats = trinkets.getFromJSONRequest(json,"titles");
            String[] titles = cats.split(",");
            titleArr = new ArrayList<>(Arrays.asList(titles));
        }
        return generateSchema(company,name,file,titleArr,format);
    }
}

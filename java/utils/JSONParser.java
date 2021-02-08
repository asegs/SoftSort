package utils;

import objects.JSON;
import objects.Schema;

import java.util.ArrayList;
import java.util.Arrays;

public class JSONParser {
    public ArrayList<JSON> parseJSON(String json){
        ArrayList<JSON> rows = new ArrayList<>();
        String[] lines = json.split("\n");
        for (String line:lines){
            if (line.contains(":")){
                line = line.strip();
                line = line.replaceAll("\"","");
                if (line.substring(line.length()-1).equals(",")){
                    line = line.substring(0,line.length()-1);
                }
                String[] tabs = line.split(":");
                rows.add(new JSON(tabs[0],tabs[1]));
            }
        }
        return rows;
    }

    public ArrayList<JSON> specificJSONParser(String json){
        ArrayList<JSON> rows = new ArrayList<>();
        rows.add(new JSON("topic",json.substring(json.indexOf("{\"topic\":")+10,json.indexOf(",\"choices\":")-1)));
        rows.add(new JSON("choices",json.substring(json.indexOf("\"choices\":")+11,json.indexOf(",\"weights\":")-1).replaceAll("\"","")));
        rows.add(new JSON("weights",json.substring(json.indexOf("\"weights\":")+11,json.indexOf(",\"count\":")-1)));

        rows.add(new JSON("count",json.substring(json.indexOf("\"count\":")+9,json.indexOf("\",\"company\":"))));
        rows.add(new JSON("company",json.substring(json.indexOf("\"company\":")+11,json.indexOf("\",\"duplicates\""))));
        rows.add(new JSON("duplicates",json.substring(json.indexOf("\"duplicates\"")+14,json.length()-2)));
        return rows;
    }

    public boolean newSchemaGenerator(String json){
        String format = json.substring(json.indexOf("\"format\":\"")+10,json.indexOf("\",\"schema\""));
        json = json.substring(json.indexOf("\",\"schema\""));
        String filename = json.substring(json.indexOf("\"name\":\"")+8,json.indexOf("\",\"key\""));
        String key = json.substring(json.indexOf("\"key\":")+7,json.length()-2);
        CompanyEditor companyEditor = new CompanyEditor();
        String company = companyEditor.getCompForKey(key);
        if (company.equals("")){
            System.out.println("Invalid key!");
            return false;
        }
        json = json.substring(json.indexOf("\"schema\":")+11,json.indexOf("\"name\":\"")-1);
        String[] newAttributes = json.split("],\\[");
        String toWrite = "";
        for (String str:newAttributes){
            boolean numeric = Boolean.parseBoolean(str.substring(0,str.indexOf(',')));
            String attName = str.substring(str.indexOf('"')+1,str.indexOf('"',str.indexOf('"')+1));
            str = str.replaceAll("\\[\\[","");
            String options = str.substring(str.indexOf('['),str.indexOf(']')).replaceAll("\"","");
            options = options.replaceAll("]","");
            options = options.replaceAll("\\[","");
            //options = options.replaceAll(" ","");
            String[] opArr = options.split(",");
            if (numeric){
                toWrite+="+"+attName+"<M>\n";
            }
            else{
                toWrite+="+"+attName+"\n";
                for (String opt:opArr){
                    if (opt.length()>0){
                        toWrite+="-"+opt+"\n";
                    }
                }
            }


        }
        if (format.length()>0){
            toWrite+="#"+format+"\n";
        }
    WriteToFile writeToFile = new WriteToFile();
        writeToFile.writeSchema(company,filename,toWrite);
        return true;
    }

    public boolean newDataAdder(String fileText){
        String[] chopped = fileText.split("\n");
        String toWrite = "";
        String topic = "";
        String key ="";
        boolean seenContentDispo = false;
        boolean started = false;
        boolean readyToLogName = false;
        boolean readyToLogKey = false;
        for (String str:chopped){
            str = str.strip();
            if (str.contains("-----------------------------")){
                started = false;
            }
            if (started && str.length()>0){
                toWrite+=str+"\n";
            }
            else if (str.contains("Content-Type")){
                started = true;
            }
            else if (str.contains("Content-Disposition")){
                if (seenContentDispo){
                    readyToLogName = true;
                }
                seenContentDispo = true;
            }
            else if (readyToLogName&&str.length()>0&&topic.equals("")){
                topic=str;
            }
            if (str.equals("Content-Disposition: form-data; name=\"key\"")){
                readyToLogKey = true;
            }
            else if (readyToLogKey &&str.strip().length()>0&&key.equals("")){
                key = str;
            }
        }
        CompanyEditor companyEditor = new CompanyEditor();
        String company = companyEditor.getCompForKey(key);
        if (company.equals("")){
            System.out.println("Key not accepted.");
            return false;
        }


        WriteToFile writeToFile = new WriteToFile();
        writeToFile.writeData(company,topic,toWrite);
        return true;
    }

    public ArrayList<JSON> parsePyReq(String pyJSON){
        pyJSON = pyJSON.replaceAll("}","");
        pyJSON = pyJSON.replaceAll("\\{","");
        pyJSON = pyJSON.replaceAll("\"","");
        String[] segments = pyJSON.split(", ");
        ArrayList<JSON> objs = new ArrayList<>();
        for (String seg:segments){
            String[] pair = seg.split(": ");
            JSON jPair = new JSON(pair[0],pair[1]);
            objs.add(jPair);
         }
        return objs;
    }


    public ArrayList<ArrayList<String>> getCommentsFromRequest(String body){
        body = body.replaceAll("\"\"","\"*!*\"");
        ArrayList<ArrayList<String>> result = new ArrayList<>();
        String attrComments = body.substring(body.indexOf("\"attrComments\":")+18,body.length()-4);
        String[] attrCommentArrs = attrComments.split("],\\[");
        for (String arr:attrCommentArrs){
            String[] lines = arr.split("\",\"");
            for (int i=0;i<lines.length;i++){
                lines[i] = lines[i].replaceAll("\\*!*","");
            }
            result.add(new ArrayList<>(Arrays.asList(lines)));
        }
        String nameComments = body.substring(body.indexOf("\"nameComments\":")+17,body.indexOf("\"],\"attrComments\":"));
        String[] names = nameComments.split("\",\"");
        for (int i=0;i<names.length;i++){
            names[i] = names[i].replaceAll("\\*!*","");
        }
        result.add(new ArrayList<>(Arrays.asList(names)));
        return result;
    }
    public String getKey(String body){
        return body.substring(body.indexOf("\"keyText\":\"")+11,body.indexOf("\"",body.indexOf("\"keyText\":\"")+16));
    }
}

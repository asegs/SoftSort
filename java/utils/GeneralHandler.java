package utils;

import java.io.File;
import java.io.IOException;
import java.util.*;

public class GeneralHandler {
    Trinkets trinkets = new Trinkets();
    FileReader fileReader = new FileReader();
    CompanyEditor companyEditor = new CompanyEditor();
    WriteToFile writeToFile = new WriteToFile();
    public ArrayList<String> getAllGeneralTopics(){
        ArrayList<String> result = new ArrayList<>();
        String generalFile = fileReader.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\General.txt");
        String[] generalRows = generalFile.split("\n");
        for (String line:generalRows){
            result.add(line.substring(0,line.indexOf(',')));
        }
        return result;
    }

    public ArrayList<String> getGeneralSchemaTopic(String topic){
        ArrayList<String> result = new ArrayList<>();
        String generalFile = fileReader.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\General.txt");
        String[] generalRows = generalFile.split("\n");
        for (String row:generalRows){
            String[] generals = row.split(",");
            if (generals[0].equals(topic)){
                result.addAll(Arrays.asList(generals).subList(1, generals.length));
            }
        }
        return result;
    }

    public ArrayList<HashSet<String>> getNewSchemaForGeneral(String topic){
        AutoSchema autoSchema = new AutoSchema();
        FileReader reader = new FileReader();
        Counter counter = new Counter();
        ArrayList<HashSet<String >> result = new ArrayList<>();
        int params = getGeneralSchemaTopic(topic).size();
        for (int i=0;i<params;i++){
            result.add(new HashSet<>());
        }
        File folder = new File("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files");
        for (final File fileEntry : folder.listFiles()) {
            if (fileEntry.isDirectory()) {
                String filename = "C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+fileEntry.getName()+"\\"+topic+"General.txt";
                File general = new File(filename);
                if (general.exists()){
                    result = autoSchema.getHashSetFromData(result,reader.read(filename),counter.getGeneralNumerics(topic));
                }
            }
        }

        return result;
    }

    public ArrayList<Boolean> getNumerics(String topic){
        ArrayList<Boolean> result = new ArrayList<>();
        String generalFile = fileReader.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\General\\"+topic+"Schema.txt");
        String[] originalSchemaLines = generalFile.split("\n");
        for (String str:originalSchemaLines){
            if (str.charAt(0)=='+'){
                if (str.contains("<M>")){
                    result.add(true);
                }
                else{
                    result.add(false);
                }
            }
        }
        return result;

    }

    public ArrayList<ArrayList<Integer>> countGeneralTopic(String topic){
        Counter counter = new Counter();
        ArrayList<ArrayList<Integer>> result = new ArrayList<>();
        File folder = new File("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files");
        ArrayList<ArrayList<ArrayList<Integer>>> counts = new ArrayList<>();
        for (final File fileEntry : folder.listFiles()) {
            if (fileEntry.isDirectory()) {
                String filename = "C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+fileEntry.getName()+"\\"+topic+"General.txt";
                File general = new File(filename);
                if (general.exists()){
                    counts.add(counter.countToMap(fileEntry.getName(),topic,true));
                }
            }
        }
        if (counts.size()>0){
            for (int row=0;row<counts.get(0).size();row++){
                ArrayList<Integer> temp = new ArrayList<>();
                for (int col=0;col<counts.get(0).get(row).size();col++){
                    for (int slice=0;slice<counts.size();slice++){
                        try {
                            temp.set(col,temp.get(col)+counts.get(slice).get(row).get(col));
                        }
                        catch (Exception e){
                            temp.add(counts.get(slice).get(row).get(col));
                        }
                    }
                }
                result.add(temp);
            }
        }
        return result;
    }

    public ArrayList<ArrayList<Double>> getGeneralMinMax(String topic){
        Counter counter = new Counter();
        ArrayList<ArrayList<Double>> result = new ArrayList<>();
        File folder = new File("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files");
        ArrayList<ArrayList<ArrayList<Double>>> counts = new ArrayList<>();
        for (final File fileEntry : folder.listFiles()) {
            if (fileEntry.isDirectory()) {
                String filename = "C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+fileEntry.getName()+"\\"+topic+"General.txt";
                File general = new File(filename);
                if (general.exists()){
                    counts.add(counter.getMinMaxFromData(fileEntry.getName(),topic,true));
                }
            }
        }
        if (counts.size()>0){
            for (int row=0;row<counts.get(0).size();row++){
                ArrayList<Double> temp = new ArrayList<>();
                for (int slice=0;slice<counts.size();slice++){
                    try {
                        temp.add(counts.get(slice).get(row).get(0));
                        temp.add(counts.get(slice).get(row).get(1));
                    }
                    catch (Exception e){
                        temp=null;
                    }
                }
                ArrayList<Double> realMinMax = new ArrayList<>();
                if (temp!=null){
                    realMinMax.add(Collections.min(temp));
                    realMinMax.add(Collections.max(temp));
                }
                else{
                    realMinMax.add(null);
                }
                result.add(temp);
            }

        }
        return result;
    }



    public ArrayList<HashSet<String>> addNewTopicToSchema(String body,ArrayList<HashSet<String>> originalSchema,ArrayList<Boolean> numerics){
        String[] newFile = body.split("\n");
        for (String line:newFile){
            String[] tokens = line.split(",");
            for (int i=2;i<tokens[0].length();i++){
                if (!numerics.get(i-2)){
                    originalSchema.get(i-2).add(tokens[i]);
                }
            }
        }
        return originalSchema;
    }

    public void addLinkToCompanyLinks(String format, String topic,String company){
        String companyLinks = fileReader.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\CompanyLinks.txt");
        String[] rows = companyLinks.split("\n");
        String toWrite = "";
        boolean found = false;
        for (String row:rows){
            String[] tokens = row.split(",");
            if (tokens[0].equals(company)&&tokens[1].equals(topic)){
                toWrite+=company+","+topic+","+format+"\n";
                found = true;
            }
            else{
                toWrite+=row+"\n";
            }
        }
        if (!found){
            toWrite+=company+","+topic+","+format+"\n";
        }
        writeToFile.write("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\CompanyLinks.txt",toWrite);
    }

    public ArrayList<String> getAllCompaniesInGeneral(String topic){
        File folder = new File("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files");
        ArrayList<String> result = new ArrayList<>();
        for (final File fileEntry:folder.listFiles()){
            if (fileEntry.isDirectory()&&!fileEntry.getName().equals("General")){
                File test = new File("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+fileEntry.getName()+"\\"+topic+"General.txt");
                if (test.exists()){
                    result.add(fileEntry.getName());
                }
            }
        }
        return result;
    }

    public ArrayList<String> getLinksListFromGeneral(String topic){
        ArrayList<String> companyNames = getAllCompaniesInGeneral(topic);
        String companyLinks = fileReader.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\CompanyLinks.txt");
        ArrayList<String> result = new ArrayList<>();
        String[] rows = companyLinks.split("\n");
        ArrayList<String> companyOrder = new ArrayList<>();
        for (String row:rows){
            String[] tokens = row.split(",");
            if (companyNames.contains(tokens[0])&&topic.equals(tokens[1])){
                companyOrder.add(tokens[0]);
                result.add(tokens[2]);
                companyNames.remove(tokens[0]);
            }
        }
        for (String noLinks:companyNames){
            companyOrder.add(noLinks);
            result.add("");
        }
        String formattedComps = "";
        for (String companyName:companyOrder){
            formattedComps+=companyName+"!*!";
        }
        result.add(formattedComps);
        return result;
    }

    public void writeGeneralSchema(ArrayList<HashSet<String>> newSchema,ArrayList<String> titles,String topic){
        String toWrite = "";
        for (int i=0;i<titles.size();i++){
            toWrite+="+"+titles.get(i)+"\n";
            for (String option:newSchema.get(i)){
                toWrite+="-"+option+"\n";
            }
        }
        writeToFile.write("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\General\\"+topic+"Schema.txt",toWrite);
        SchemaEditor schemaEditor = new SchemaEditor();
        schemaEditor.genericDetailSchema("General",topic,countGeneralTopic(topic),getGeneralMinMax(topic));
    }

    public boolean uploadGeneralSchema(String schema) throws IOException, InterruptedException {
        String key = trinkets.getFromJSONRequest(schema,"key").trim();
        String topic = trinkets.getFromJSONRequest(schema,"name").trim();
        String format = trinkets.getFromJSONRequest(schema,"format").trim();
        boolean headers = Boolean.parseBoolean(trinkets.getFromJSONRequest(schema,"headers").trim());
        String company = companyEditor.getCompForKey(key.trim());
        if (company.equals("")){
            System.out.println("Invalid key!");
            return false;
        }
        for (int i=0;i<8;i++){
            schema = schema.substring(trinkets.getIndexOfFirstReturn(schema)+1);
        }
        String file = "";
        if (headers){
            file = schema.substring(trinkets.getIndexOfFirstReturn(schema)+2,schema.indexOf("---"));
        }
        else {
            file = schema.substring(0, schema.indexOf("---"));
        }
        HttpReqMaker reqMaker = new HttpReqMaker();
        reqMaker.setSize(company,topic,true,file.split("\n").length);
        writeToFile.write("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"General.txt",file);
        if (format.contains("<I>")){
            addLinkToCompanyLinks(format,topic,company);
        }
        ArrayList<Boolean> numerics = getNumerics(topic);
        ArrayList<HashSet<String>> previousSchema = getNewSchemaForGeneral(topic);
        ArrayList<HashSet<String>> finalSchema = addNewTopicToSchema(file,previousSchema,numerics);
        ArrayList<String> titles = getGeneralSchemaTopic(topic);
        writeGeneralSchema(finalSchema,titles,topic);
        return true;
    }
}

package utils;

import java.io.File;
import java.util.ArrayList;

public class CompanyEditor {
    FileReader fr = new FileReader();
    WriteToFile wtf = new WriteToFile();
    public void addCompany(String name,String key){
        String companies = fr.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\Companies.txt");
        String newName = name+","+key;
        companies+=newName;
        wtf.write("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\Companies.txt",companies);
        File file = new File("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+name);
        file.mkdir();
    }
    public void changeKey(String name,String key){
        String companies = fr.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\Companies.txt");
        String newName = name+","+key;
        String[] companyArr = companies.split("\n");
        StringBuilder result = new StringBuilder();
        for (String company:companyArr){
            String[] pair = company.split(",");
            if (pair[0].equals(name)){
                result.append(newName).append("\n");
            }
            else{
                result.append(company).append("\n");
            }
        }
        wtf.write("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\Companies.txt",result.toString());
    }

    public ArrayList<String> getAllComps(){
        String companies = fr.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\Companies.txt");
        ArrayList<String> comps = new ArrayList<>();
        comps.add("General");
        String[] compArr = companies.split("\n");
        for (String comp:compArr){
            comps.add(comp.split(",")[0]);
        }
        return comps;
    }

    public String getCompForKey(String key){
        String companies = fr.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\Companies.txt");
        String[] compArr = companies.split("\n");
        for (String comp:compArr){
            String[] pair = comp.split(",");
            if (pair[1].equals(key)){
                return pair[0];
            }
        }
        return "";
    }

    public ArrayList<String> getAllTopicsForCompany(String company){
        File companyFile = new File("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company);
        ArrayList<String> result = new ArrayList<>();
        String[] files = companyFile.list();
        if (files==null){
            return result;
        }
        for (String file:files){
            if (file.contains("Data")||file.contains("General")){
                int descriptorIndex = Math.max(file.indexOf("Data"),file.indexOf("General"));
                String fmt = file.substring(0,descriptorIndex)+" ("+file.substring(descriptorIndex,file.indexOf("."))+")";
                result.add(fmt);
            }
        }
        return result;
    }

    public void deleteTopics(String company,String topic){
        SchemaEditor schemaEditor = new SchemaEditor();
        GeneralHandler generalHandler = new GeneralHandler();
        File dataFile = new File("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Data.txt");
        File generalFile = new File("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"General.txt");
        File schemaFile = new File("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Schema.txt");
        if (generalFile.exists()){
            generalFile.delete();
            schemaEditor.genericDetailSchema("General",topic,generalHandler.countGeneralTopic(topic),generalHandler.getGeneralMinMax(topic));
            return;
        }
        dataFile.delete();
        schemaFile.delete();

    }
}

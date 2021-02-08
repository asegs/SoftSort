package utils;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;

public class DataReader {
    FileReader fileReader = new FileReader();
    public ArrayList<ArrayList<String>> getData (String company,String topic){
        ArrayList<ArrayList<String>> all = new ArrayList<>();
        String data = "";
        try {
            String filename = "C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\" + company + "\\" + topic + "Data.txt";
            data = fileReader.read(filename);
        }
        catch (Exception e){
            String filename = "C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\" + company + "\\" + topic + "General.txt";
            data = fileReader.read(filename);
        }
        String[] items = data.split("\n");
        for (String item:items){
            if (!item.contains(",")){
                continue;
            }
            ArrayList<String> row = new ArrayList<>();
                String[] entries = item.split(",");
                row = new ArrayList<>(Arrays.asList(entries));
            all.add(row);
        }
        return all;
    }

    public ArrayList<ArrayList<String>> getGeneralData(String topic){
        File files = new File("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\");
        String[] pathnames = files.list();
        ArrayList<ArrayList<String>> all = new ArrayList<>();
        for (String file:pathnames){
            if (!file.contains(".")&&!file.equals("General")){
                File folder = new File("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+file);
                String[] fileNames = folder.list();
                for (String str:fileNames){
                    if (str.contains("General")){
                        String generalData = fileReader.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+file+"\\"+str);
                        String[] contents = generalData.split("\n");
                        for (String data:contents) {
                            if (!data.contains(",")){
                                continue;
                            }
                            ArrayList<String> row = new ArrayList<>();
                            String[] entries = data.split(",");
                            row = new ArrayList<>(Arrays.asList(entries));
                            row.add(file);
                            all.add(row);
                        }
                    }
                }
            }
        }
        return all;
    }
}

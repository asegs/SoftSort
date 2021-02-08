package utils;

import java.io.File;
import java.util.ArrayList;

public class TopicSeeker {

    public ArrayList<String> getTopicNames(String company){
        if (company.equals("")){
            return new ArrayList<>();
        }
        ArrayList<String> topics = new ArrayList<>();
        File filesDirectory = new File("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company);
        if (!filesDirectory.exists()){
            return new ArrayList<>();
        }
        String[] pathNames = filesDirectory.list();
        for (String name:pathNames){
            String noExt = name.substring(0,name.indexOf('.'));
            if (noExt.contains("Schema")){
                topics.add(noExt.substring(0,noExt.indexOf("Schema")));
            }
        }
        return topics;
    }
}

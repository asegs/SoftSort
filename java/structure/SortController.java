package structure;

import objects.JSON;
import objects.Schema;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import utils.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/softsort")
public class SortController {
    JSONParser parser = new JSONParser();
    Trinkets trinket = new Trinkets();
    SoftSortEngine engine = new SoftSortEngine();
    TopicSeeker topicSeeker = new TopicSeeker();
    SchemaReader schemaReader =  new SchemaReader();
    CompanyEditor companyEditor = new CompanyEditor();
    AutoSchema autoSchema = new AutoSchema();
    GeneralHandler generalHandler = new GeneralHandler();
    Counter counter = new Counter();
    SchemaEditor schemaEditor = new SchemaEditor();

    @PutMapping("/query")
    public ArrayList<ArrayList<String>> softSort(@RequestBody String body){
        System.out.println(body);
        double startTime = System.nanoTime();
        ArrayList<JSON> objects = parser.specificJSONParser(body);
        String company = trinket.getValueOfJSONKey(objects,"company");
        String topic = trinket.getValueOfJSONKey(objects,"topic");
        boolean duplicates = Boolean.parseBoolean(trinket.getValueOfJSONKey(objects,"duplicates"));
        System.out.println(duplicates);
        System.out.println(trinket.getValueOfJSONKey(objects,"duplicates"));
        System.out.println("Request made to query "+topic+" with the parameters:");
        System.out.println(body);
        ArrayList<ArrayList<String>> choices = trinket.choiceSetter(trinket.getValueOfJSONKey(objects,"choices"));
        ArrayList<Double> weights = trinket.stringToDoublesArray(trinket.getValueOfJSONKey(objects,"weights"));
        int count = Integer.parseInt(trinket.getValueOfJSONKey(objects,"count"));
        ArrayList<ArrayList<Double>> minMax = schemaReader.getMinMaxFromSchema(company,topic);
        ArrayList<ArrayList<String>> result = engine.softSortOuter(company,topic,choices,weights,count,minMax,duplicates);
        try {
            System.out.println("Top result: " + result.get(0).get(1));
        }
        catch (Exception e){
            ;
        }
        double endTime = System.nanoTime();
        System.out.println(((endTime-startTime)/1000000)+"ms total run time.");
        return result;
    }

    @GetMapping("/topics/{company}")
    public ArrayList<String> topics(@PathVariable String company){
        System.out.println("Request made to view topics.");
        return topicSeeker.getTopicNames(company);
    }

//    @GetMapping("/schema/{company}/{topic}")
//    public ArrayList<ArrayList<String>> schema(@PathVariable String company ,@PathVariable String topic){
//        System.out.println("Request made to view schema of topic "+topic);
//        return schemaReader.parseSchemaFileWithCats(company,topic);
//    }

    @GetMapping("/loadallschema/{key}")
    public ArrayList<ArrayList<ArrayList<String>>> getAllSchema(@PathVariable String key){
        String company = companyEditor.getCompForKey(key);
        ArrayList<ArrayList<ArrayList<String>>> result = new ArrayList<>();
        if (company.length()==0){
            return result;
        }
        ArrayList<String> topicNames = topicSeeker.getTopicNames(company);
        for (String name:topicNames){
            result.add(schemaReader.parseSchemaFileWithCats(company,name));
        }
        return result;
    }

    @GetMapping("/loadallcomments/{key}")
    public ArrayList<ArrayList<ArrayList<String>>> getAllComments(@PathVariable String key){
        String company = companyEditor.getCompForKey(key);
        ArrayList<ArrayList<ArrayList<String>>> result = new ArrayList<>();
        if (company.length()==0){
            return result;
        }
        ArrayList<String> topicNames = topicSeeker.getTopicNames(company);
        for (String name:topicNames){
            result.add(schemaReader.getCommentsFromSchema(company,name));
        }
        return result;
    }

    @GetMapping("/loadalltopics/{key}")
    public ArrayList<String> getAllTopics(@PathVariable String key){
        String company = companyEditor.getCompForKey(key);
        if (company.length()==0){
            return new ArrayList<>();
        }
        return topicSeeker.getTopicNames(company);
    }

//    @GetMapping("/url/{company}/{topic}")
//    public ArrayList<String> getUrlString(@PathVariable String company ,@PathVariable String topic){
//        System.out.println("Request made to view url of topic "+topic);
//        if (company.equals("General")){
//            return generalHandler.getLinksListFromGeneral(topic);
//        }
//        else {
//            String result = schemaReader.getUrlString(company, topic);
//            ArrayList<String> test = new ArrayList<>();
//            test.add(result);
//            return test;
//        }
//    }

//    @GetMapping("/schemacount/{company}/{topic}")
//    public ArrayList<ArrayList<Integer>> count(@PathVariable String company,@PathVariable String topic){
//        System.out.println("Schema "+topic+" counted!");
//        return schemaReader.getCountFromSchema(company,topic);
//    }

    @PostMapping("/schema")
    public boolean addSchema(@RequestBody String body){
        return parser.newSchemaGenerator(body);
    }

    @PostMapping("/upload")
    public boolean addData(@RequestBody String body){
        return parser.newDataAdder(body);
    }

    @PutMapping("/changekey")
    public void changeKey(@RequestBody String body){
        ArrayList<JSON> objects = parser.parsePyReq(body);
        String name = trinket.getValueOfJSONKey(objects,"name");
        String newKey = trinket.getValueOfJSONKey(objects,"new_key");
        companyEditor.changeKey(name,newKey);
    }

    @PostMapping("/addcompany")
    public void addComp(@RequestBody String body){
        ArrayList<JSON> objects = parser.parsePyReq(body);
        String name = trinket.getValueOfJSONKey(objects,"name");
        String newKey = trinket.getValueOfJSONKey(objects,"new_key");
        for (JSON json:objects){
            json.prettyPrint();
        }
        companyEditor.addCompany(name,newKey);
    }

    @GetMapping("/companies")
    public ArrayList<String> companies(){
        System.out.println("Request made to view companies.");
        return companyEditor.getAllComps();
    }

    @PostMapping("/titlescount")
    public ArrayList<String> getTitlesCount(@RequestBody String body){
        for (int i=0;i<10;i++){
            body = body.substring(trinket.getIndexOfFirstReturn(body)+2);
        }
        return autoSchema.getRequiredTitles(body);
    }

    @PostMapping("/autoschema")
    public boolean autoSchema(@RequestBody String body){
        try {
            return autoSchema.initialParser(body);
        }
        catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    @GetMapping("/generalcats")
    public ArrayList<String> getGeneralCats(){
        System.out.println("Requested general topics.");
        return generalHandler.getAllGeneralTopics();
    }

    @GetMapping("/generalschema/{topic}")
    public ArrayList<String> getSchemaForGeneralTopic(@PathVariable String topic){

        if (topic.equals("undefined")){
            return new ArrayList<>();
        }
        System.out.println("Got general schema for "+topic+".");
        return generalHandler.getGeneralSchemaTopic(topic);
    }

    @PostMapping("/generaldata")
    public boolean uploadGeneralData(@RequestBody String body){
        try {
            return generalHandler.uploadGeneralSchema(body);
        }
        catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    @PutMapping("/generalquery")
    public ArrayList<ArrayList<String>> generalSoftSort(@RequestBody String body){
        System.out.println("Request made to query general with the parameters:");
        System.out.println(body);
        ArrayList<JSON> objects = parser.specificJSONParser(body);
        String topic = trinket.getValueOfJSONKey(objects,"topic");
        ArrayList<Double> weights = trinket.stringToDoublesArray(trinket.getValueOfJSONKey(objects,"weights"));
        ArrayList<ArrayList<String>> choices = trinket.choiceSetter(trinket.getValueOfJSONKey(objects,"choices"));
        int count = Integer.parseInt(trinket.getValueOfJSONKey(objects,"count"));
        ArrayList<ArrayList<Double>> minMax = schemaReader.getMinMaxFromSchema("General",topic);
        ArrayList<ArrayList<String>> result =  engine.softSortOuter("General",topic,choices,weights,count,minMax,true);
        try {
            System.out.println("Top result: " + result.get(0).get(1));
        }
        catch (Exception e){
            ;
        }
        return result;
    }

    @GetMapping("/gettopicsbykey/{key}")
    public ArrayList<ArrayList<String>> getTopicsByKey(@PathVariable String key){
        String company = companyEditor.getCompForKey(key);
        ArrayList<ArrayList<String>> result = new ArrayList<>();
        result.add(topicSeeker.getTopicNames(company));
        ArrayList<String> simpleComp = new ArrayList<>();
        simpleComp.add(company);
        result.add(simpleComp);
        return result;
    }
//    @GetMapping("/getminmax/{company}/{topic}")
//    public ArrayList<ArrayList<Double>> getMinMax(@PathVariable String company,@PathVariable String topic){
//        return schemaReader.getMinMaxFromSchema(company,topic);
//    }

    @PostMapping("/uploadadvancedschema/{topic}")
    public boolean uploadAdvancedSchema(@PathVariable String topic,@RequestBody String body){
        System.out.println("Advanced schema uploaded for topic "+topic);
        ArrayList<ArrayList<String>> comments = parser.getCommentsFromRequest(body);
        String company = companyEditor.getCompForKey(parser.getKey(body));
        if (company.equals("")){
            return false;
        }
        try {
            schemaEditor.appendCommentsToSchema(company, topic, comments);
        }
        catch (Exception e){
            return false;
        }
        return true;
    }

    @GetMapping("/getmysets/{key}")
    public ArrayList<String> getMySets(@PathVariable String key){
        System.out.println("Called sets with key: "+key);
        String company = companyEditor.getCompForKey(key);
        ArrayList<String> result = new ArrayList<>();
        if (company.length()==0){
            return result;
        }
        return companyEditor.getAllTopicsForCompany(company);
    }

    @GetMapping("/deletefile/{key}/{topic}")
    public void deleteFile(@PathVariable String key,@PathVariable String topic){
        String company = companyEditor.getCompForKey(key);
        if (company.length()==0){
            return;
        }
        companyEditor.deleteTopics(company,topic);

    }

    @PostMapping("/loadtopic/{company}/{topic}")
    public ArrayList<Object> loadTopics(@PathVariable String company,@PathVariable String topic,@RequestBody String body) throws IOException, InterruptedException {
        ArrayList<Object> result = new ArrayList<>();
        HttpReqMaker reqMaker = new HttpReqMaker();
        String password = body.replaceAll("\"","");
        if (!reqMaker.unlock(company,topic,password)&&!company.equals("General")){
            System.out.println("Incorrect password attempted.");
            return result;
        }
        result.add("Schema:");
        result.addAll(schemaReader.parseSchemaFileWithCats(company,topic));
        result.add("Count:");
        result.addAll(schemaReader.getCountFromSchema(company,topic));
        result.add("MinMax:");
        result.addAll(schemaReader.getMinMaxFromSchema(company,topic));
        result.add("Url:");
        if (company.equals("General")){
            result.add(generalHandler.getLinksListFromGeneral(topic));
            result.add("Comments:");
            result.add(new ArrayList<>());
        }
        else {
            String res = (schemaReader.getUrlString(company, topic));
            ArrayList<String> capsule = new ArrayList<>();
            capsule.add(res);
            result.add(capsule);
            result.add("Comments:");
            result.add(schemaReader.getCommentsFromSchema(company,topic));
        }
        return result;
    }



}

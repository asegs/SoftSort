package objects;

public class JSON {
    private String title;
    private String body;

    public JSON(String title,String body){
        this.title = title;
        this.body = body;
    }

    public String getTitle(){
        return title;
    }

    public String getBody(){
        return body;
    }

    public void prettyPrint(){
        System.out.println(title+": "+body);
    }
}

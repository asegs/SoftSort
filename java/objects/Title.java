package objects;

import java.util.ArrayList;

public class Title extends Schema{
    private ArrayList<Subtitle> subtitles;
    public Title(String name, String desc) {
        super(name, desc);
        subtitles = new ArrayList<>();
    }

    public void addSubtitle(Subtitle subtitle){
        this.subtitles.add(subtitle);
    }
    public Subtitle getSubtitle(int i){
        return this.subtitles.get(i);
    }

    public ArrayList<Subtitle> getSubtitles(){
        return this.subtitles;
    }

    @Override
    public void prettyPrint(){
        System.out.println("Name: "+this.getName());
        System.out.println("Desc: "+this.getDesc());
        for (Subtitle st:subtitles){
            System.out.println("Subtitle name: "+st.getName());
            System.out.println("Subtitle desc: "+st.getDesc());
        }
    }
}

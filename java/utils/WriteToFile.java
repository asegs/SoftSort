package utils;

import java.io.File;  // Import the File class
import java.io.IOException;  // Import the IOException class to handle errors
import java.io.FileWriter;   // Import the FileWriter class

public class WriteToFile {
    public void writeSchema(String company,String topic,String body) {
        try {
            FileWriter myWriter = new FileWriter("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Schema.txt");
            myWriter.write(body);
            myWriter.close();
            System.out.println("Successfully wrote to the file.");
        } catch (IOException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }
    }

    public void writeData(String company,String topic,String body){
        try {
            FileWriter myWriter = new FileWriter("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\resources\\files\\"+company+"\\"+topic+"Data.txt");
            myWriter.write(body);
            myWriter.close();
            System.out.println("Successfully wrote to the file.");
        } catch (IOException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }
    }

    public void write(String filename,String body){
        try {
            FileWriter myWriter = new FileWriter(filename);
            myWriter.write(body);
            myWriter.close();
            System.out.println("Successfully wrote to the file.");
        } catch (IOException e) {
            System.out.println("Filename: "+filename);
            System.out.println("File body: "+body);
            System.out.println("An error occurred.");
            e.printStackTrace();
        }
    }
}

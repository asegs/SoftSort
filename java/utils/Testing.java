package utils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

public class Testing {
    public static void main(String[] args) throws IOException, InterruptedException {
        FileReader reader = new FileReader();
        double start = System.nanoTime();
        String words = reader.read("C:\\Users\\aarse\\Documents\\Softsort\\src\\main\\java\\utils\\words.txt");
        double end = System.nanoTime();
        System.out.println((end-start)/1000000000);
    }
}

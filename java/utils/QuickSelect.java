package utils;

import java.util.Random;


public final class QuickSelect {

    public int getIndexOfLargest(Double[] array){
        int index = -1;
        double largest = 0.0;
        for (int i=0;i<array.length;i++){
            if (array[i]>largest){
                largest=array[i];
                index=i;
            }
        }
        return index;
    }
}
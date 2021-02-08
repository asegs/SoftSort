package utils;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class HttpReqMaker {
    public boolean makeIsPrivateFlaskRequest(String company,String topic) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        String url = "http://localhost:5000/isprivate/"+company+"/"+topic;
        HttpRequest request = HttpRequest.newBuilder()
                .GET()
                .header("accept","application/json")
                .uri(URI.create(url))
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return Boolean.parseBoolean(response.body());
    }

    public boolean unlock(String company,String topic,String password) throws IOException,InterruptedException{
        HttpClient client = HttpClient.newHttpClient();
        if (password.length()==0){password = "$";}
        String url = "http://localhost:5000/datasetlogin/"+company+"/"+topic+"/"+password;
        HttpRequest request = HttpRequest.newBuilder()
                .GET()
                .header("accept","application/json")
                .uri(URI.create(url.replaceAll(" ","~")))
                .build();
        HttpResponse<String> response = client.send(request,HttpResponse.BodyHandlers.ofString());
        return Boolean.parseBoolean(response.body().trim());
    }

    public void setSize(String company,String topic,boolean general,int size) throws IOException,InterruptedException{
        HttpClient client = HttpClient.newHttpClient();
        String url = "http://localhost:5000/setsize/"+company+"/"+topic+"/"+general+"/"+size;
        HttpRequest request = HttpRequest.newBuilder()
                .GET()
                .header("accept","application/json")
                .uri(URI.create(url.replaceAll(" ","~")))
                .build();
        client.send(request,HttpResponse.BodyHandlers.ofString());
    }


}

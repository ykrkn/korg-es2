package ykrkn.es2;

import ykrkn.es2.api.SampleService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;

public class Main {

    public static void main(String[] args) {
        try {
            SampleService service = new SampleService();
            service.initWithDump(Paths.get("/Users/sx/Desktop/e2sSample.all"));
            service.getAllSamples().forEach(e -> {
                System.out.println(e);
            });
            System.out.println(service.getFreeMemorySeconds());
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(1);
        }
    }

    public static void main0(String[] args) throws IOException {
        String filename = "/Users/sx/src/korg-es2/assets/data.bin";
        System.out.println(filename);
        Path path = Paths.get(filename);
        byte[] data = Files.readAllBytes(path);
        byte[] pdata = Arrays.copyOfRange(data,
                Constants.PATTERNS_FILE_OFFSET,
                Constants.PATTERNS_FILE_OFFSET+Constants.PATTERN_BLOCK_SIZE);

        Pattern p = new Pattern();
        p.readFromByteArray(pdata);
        System.out.println(p);
    }
}

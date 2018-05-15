package com.ykrkn.electribe;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;

public class Main {

    public static void main(String[] args) throws IOException {
        String filename = "/Users/yurykrikun/src/korg-es2/assets/data.bin";
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

package com.ykrkn.electribe;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;

public class Main {

    public static void main(String[] args) throws IOException {
        String filename = "/Users/yurykrikun/src/korg-es2/assets/data.bin";
        System.out.println(filename);
        try (RandomAccessFile file = new RandomAccessFile (filename, "r")) {
            try (FileChannel fileChannel = file.getChannel()) {
                for(int i=0; i<Constants.PATTERNS_COUNT; ++i) {
                    Pattern pattern = readPattern(fileChannel, i);
                    System.out.println(pattern);
                    for (Part part : pattern.parts) {
                        System.out.println("\t" + part);
                        for(Step step : part.steps) {
                            //System.out.println("\t\t" + step);
                        }
                    }
                }
            }
        }
    }

    private static Pattern readPattern(FileChannel fileChannel, int offset) throws IOException {
        MappedByteBuffer buffer = fileChannel.map(
                FileChannel.MapMode.READ_ONLY,
                Constants.PATTERNS_FILE_OFFSET + (offset * Constants.PATTERN_BLOCK_SIZE),
                Constants.PATTERN_BLOCK_SIZE);
        buffer.load();
        Pattern p = new Pattern();
        p.readFromBuffer(buffer);
        return p;
    }
}

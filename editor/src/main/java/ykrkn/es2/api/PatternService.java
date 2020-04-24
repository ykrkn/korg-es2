package ykrkn.es2.api;

import struct.JavaStruct;
import struct.StructException;
import ykrkn.es2.Constants;

import java.io.IOException;
import java.nio.ByteOrder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;

public class PatternService implements Service {
    
    byte[] source;

    PatternStruct[] patterns = new PatternStruct[Constants.PATTERNS_COUNT];

    public void initWithDump(Path path) throws InvalidStructError {
        try {
            unpack(Files.readAllBytes(path));
        } catch (IOException e) {
            throw new InvalidStructError(e);
        }
    }
    
    @Override
    public void unpack(byte[] src) {
        this.source = src;
        
        try {
            for (int i = 0; i < Constants.PATTERNS_COUNT; i++) {
                int offset = Constants.PATTERNS_FILE_OFFSET + (i * Constants.PATTERN_BLOCK_SIZE);
                byte[] struct = Arrays.copyOfRange(src, offset, offset+Constants.PATTERN_BLOCK_SIZE);
                PatternStruct p = new PatternStruct();
                JavaStruct.unpack(p, struct, ByteOrder.LITTLE_ENDIAN);
                p.validate();
                patterns[i] = p;
            }
        } catch (StructException e) {
            throw new InvalidStructError(e);
        }
    }

    @Override
    public byte[] pack() {
        System.out.println("pack IS Not Implemented");
        return source;
    }

    @Override
    public void trace() {
        
    }
}

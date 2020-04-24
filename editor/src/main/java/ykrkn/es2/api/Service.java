package ykrkn.es2.api;

import java.nio.file.Path;

public interface Service {

    void initWithDump(Path path) throws InvalidStructError;

    void unpack(byte[] src);

    byte[] pack();

    void trace();
}

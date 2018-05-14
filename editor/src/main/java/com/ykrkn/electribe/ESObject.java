package com.ykrkn.electribe;

import java.nio.ByteBuffer;

public abstract class ESObject {

    ByteBuffer buffer;

    abstract void readFromBuffer(ByteBuffer buffer);

    String bytea2str(byte[] a) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < a.length; i++) {
            if(a[i] == 0) break;
            sb.append((char) a[i]);
        }
        return sb.toString();
    }

    static int bytea2int(byte[] a) {
        return ((a[3] & 0xFF) << 24) | ((a[2] & 0xFF) << 16) | ((a[1] & 0xFF) << 8) | a[0] & 0xFF;
    }

    static short bytea2short(byte[] a) {
        return (short) (((a[1] & 0xFF) << 8) | a[0] & 0xFF);
    }

    byte[] read(int from, int to) {
        if(from != buffer.position())
            throw new RuntimeException("Invalid buffer position");

        int size = 1+to-from;
        byte[] a = new byte[size];
        buffer.get(a);
        return a;
    }

    byte readByte(int from) {
        if(from != buffer.position())
            throw new RuntimeException("Invalid buffer position");

        return buffer.get();
    }
}

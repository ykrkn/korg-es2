package com.ykrkn.electribe;

import java.util.Arrays;
import java.util.function.Function;

public class Parameter<T> {

    private int offset;
    private int length;
    private byte[] data;
    private String name;
    private Function<byte[],T> ba2val;
    private Function<T,byte[]> val2ba;

    void readFromSource(byte[] source) {
        data = Arrays.copyOfRange(source, offset, offset+length);
    }

    void writeIntoSink(byte[] sink) {
        for (int i = 0; i < data.length; i++) {
            sink[offset+i] = data[i];
        }
    }

    T getValue() {
        if(data == null) return null;
        return ba2val.apply(data);
    }

    void setValue(T value) {
        throw new RuntimeException("NOT implemented");
        // this.data = val2ba.apply(value);
    }

    static Parameter<byte[]> byteArrayParameter(String name, int from, int length) {
        Parameter<byte[]> p = new Parameter<>();
        p.name = name;
        p.offset = from;
        p.length = length;
        p.ba2val = (ba) -> Arrays.copyOfRange(ba, from, from+length);
        p.val2ba = (v) -> v;
        return p;
    }

    static Parameter<Byte> byteParameter(String name, int from) {
        Parameter<Byte> p = new Parameter<>();
        p.name = name;
        p.offset = from;
        p.length = 1;
        p.ba2val = (ba) -> ba[0];
        p.val2ba = (v) -> new byte[]{v};
        return p;
    }

    static Parameter<Short> shortParameter(String name, int from) {
        Parameter<Short> p = new Parameter<>();
        p.name = name;
        p.offset = from;
        p.length = 2;
        p.ba2val = (ba) -> (short) (((ba[1] & 0xFF) << 8) | ba[0] & 0xFF);
        p.val2ba = null;
        return p;
    }

    static Parameter<Integer> intParameter(String name, int from) {
        Parameter<Integer> p = new Parameter<>();
        p.name = name;
        p.offset = from;
        p.length = 4;
        p.ba2val = (ba) -> ((ba[3] & 0xFF) << 24) | ((ba[2] & 0xFF) << 16) | ((ba[1] & 0xFF) << 8) | ba[0] & 0xFF;
        p.val2ba = null;
        return p;
    }

    static Parameter<String> stringParameter(String name, int from, int length) {
        Parameter<String> p = new Parameter<>();
        p.name = name;
        p.offset = from;
        p.length = length;
        p.ba2val = (ba) -> {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < ba.length; i++) {
                if(ba[i] == 0) break;
                sb.append((char) ba[i]);
            }
            return sb.toString();
        };
        p.val2ba = null;
        return p;
    }

    @Override
    public String toString() {
        return "Parameter{" +
                "offset=" + offset +
                ", data=" + Arrays.toString(data) +
                ", name='" + name + '\'' +
                ", value=" + getValue() +
                '}';
    }
}

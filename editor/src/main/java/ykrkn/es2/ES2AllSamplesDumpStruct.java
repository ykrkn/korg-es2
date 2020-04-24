package ykrkn.es2;

import struct.*;

import java.io.Serializable;
import java.nio.ByteOrder;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

@StructClass
public class ES2AllSamplesDumpStruct implements Serializable {

    private static final long serialVersionUID = 1L;

    private static final String SIGNATURE = "e2s sample all";

    @StructField(order = 0)
    public CString signature = new CString(14);

    @StructField(order = 1)
    public byte[] pad1 = new byte[74];

    @StructField(order = 2)
    public int[] sampleOffsets = new int[1000];

    transient private byte[] source;

    transient private final Map<Integer, ES2AllSamplesDumpSampleStruct> samples = new LinkedHashMap<>();
    
    public static ES2AllSamplesDumpStruct unpack(byte[] src) {
        final ES2AllSamplesDumpStruct o = new ES2AllSamplesDumpStruct();
        o.source = src;

        try {
            // Header
            JavaStruct.unpack(o, Arrays.copyOfRange(src, 0, 4096), ByteOrder.LITTLE_ENDIAN);

            if(!o.validateSignature()) {
                throw new RuntimeException("Invalid File Format");
            }

            // Samples
            for (int offset : o.sampleOffsets) {
                if (offset == 0) continue;
                ES2AllSamplesDumpSampleStruct s = new ES2AllSamplesDumpSampleStruct();
                JavaStruct.unpack(s, Arrays.copyOfRange(src, offset, src.length), ByteOrder.LITTLE_ENDIAN);
                o.addSample(offset, s);
            }
            // validate
        } catch (StructException e) {
            e.printStackTrace();
        } finally {
            return o;
        }
    }

    private boolean validateSignature() {
        return Objects.equals(SIGNATURE, signature.toString());
    }

    private void addSample(int offset, ES2AllSamplesDumpSampleStruct sample) {
        samples.put(offset, sample);
    }

    public void trace() {
        for (Integer offset : samples.keySet()) {
            System.out.println("" + offset + " " + samples.get(offset));
        }
    }

    public byte[] pack() {
        byte[] sink = Arrays.copyOf(source, source.length);

        try {
            // Header
            byte[] header = JavaStruct.pack(this, ByteOrder.LITTLE_ENDIAN);
            for (int i = 0; i < header.length; i++) {
                sink[i] = header[i];
            }
            // Samples
            for (int offset : samples.keySet()) {
                if (offset == 0) continue;
                byte[] sample = JavaStruct.pack(samples.get(offset), ByteOrder.LITTLE_ENDIAN);
                for (int i = 0; i < sample.length; i++) {
                    sink[i+offset] = sample[i];
                }
            }
            return sink;
        } catch (StructException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }
}

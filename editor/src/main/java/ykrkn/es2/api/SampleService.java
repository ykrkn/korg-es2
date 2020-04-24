package ykrkn.es2.api;

import struct.JavaStruct;
import struct.StructException;
import ykrkn.es2.Constants;

import javax.sound.sampled.AudioFileFormat;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.UnsupportedAudioFileException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteOrder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;

public class SampleService {

    static final int FIRST_SLOT_NUM = 19;

    static final int SAMPLES_LENGTH = 1000;

    private SamplesDumpStruct struct;

    transient byte[] source;

    transient final SamplesDumpSampleStruct[] samples = new SamplesDumpSampleStruct[1000];

    public void initWithDump(Path path) throws IOException {
        byte[] src = Files.readAllBytes(path);
        unpack(src);
        if (!validateSignature()) {
            throw new InvalidStructError("Invalid File signature");
        }
        trace();
    }

    public List<SampleVO> getAllSamples() {
        final List<SampleVO> res = new LinkedList<>();
        for (int i = 0; i < samples.length; i++) {
            SamplesDumpSampleStruct sample = samples[i];
            if (sample == null) continue;
            res.add(SampleVO.fromStruct(i, sample));
        }
        return res;
    }

    public int getFreeMemorySeconds() {
        return Constants.SAMPLE_MEMORY_SEC - ((source.length - Constants.SAMPLE_ALL_HEADER_SIZE) / 100000);
    }

    private boolean validateSignature() {
        return Objects.equals(Constants.SAMPLE_ALL_SIGNATURE, struct.signature.toString());
    }

    public void unpack(byte[] src) {
        struct = new SamplesDumpStruct();
        source = src;

        try {
            // Header
            JavaStruct.unpack(struct, Arrays.copyOfRange(src, 0, ykrkn.es2.Constants.SAMPLE_ALL_HEADER_SIZE), ByteOrder.LITTLE_ENDIAN);

            // Samples
            for (int i=0; i<SAMPLES_LENGTH; ++i) {
                int offset =  struct.sampleOffsets[i];
                if (offset == 0) continue;
                SamplesDumpSampleStruct s = new SamplesDumpSampleStruct();
                JavaStruct.unpack(s, Arrays.copyOfRange(src, offset, src.length), ByteOrder.LITTLE_ENDIAN);
                samples[i] = s;

                try {
                    InputStream is = new ByteArrayInputStream(Arrays.copyOfRange(src, offset, offset+1024));
                    AudioFileFormat aff = AudioSystem.getAudioFileFormat(is);
                    System.out.println(aff);
                } catch (UnsupportedAudioFileException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        } catch (StructException e) {
            throw new InvalidStructError(e);
        }
    }

    public void trace() {
        for (int i = 0; i < struct.sampleOffsets.length; i++) {
            if (struct.sampleOffsets[i] == 0) continue;
            System.out.println((FIRST_SLOT_NUM + i) + " " + struct.sampleOffsets[i] + " " + samples[i]);
        }
    }

    public byte[] pack() {
        byte[] sink = Arrays.copyOf(source, source.length);

        try {
            // Header
            byte[] header = JavaStruct.pack(struct, ByteOrder.LITTLE_ENDIAN);
            for (int i = 0; i < header.length; i++) {
                sink[i] = header[i];
            }
            // Samples
            for (int i = 0; i<SAMPLES_LENGTH; ++i) {
                int offset = struct.sampleOffsets[i];
                if (offset == 0) continue;
                byte[] sample = JavaStruct.pack(samples[i], ByteOrder.LITTLE_ENDIAN);
                for (int j = 0; j < sample.length; j++) {
                    sink[j+offset] = sample[j];
                }
            }

            return sink;
        } catch (StructException e) {
            throw new InvalidStructError(e);
        }
    }
}

package ykrkn.es2.api;

import struct.JavaStruct;
import struct.StructException;
import ykrkn.es2.Constants;
import ykrkn.es2.struct.InvalidStructError;
import ykrkn.es2.struct.SamplesDumpSampleStruct;
import ykrkn.es2.struct.SamplesDumpStruct;

import javax.sound.sampled.*;
import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteOrder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;

public class SampleService implements Service {

    static final int FIRST_SLOT_NUM = 19;

    static final int SAMPLES_LENGTH = 1000;

    byte[] source;

    private SamplesDumpStruct struct;

    final SamplesDumpSampleStruct[] samples = new SamplesDumpSampleStruct[1000];
    
    public void initWithDump(Path path) throws InvalidStructError {
        try {
            unpack(Files.readAllBytes(path));
        } catch (IOException e) {
            throw new InvalidStructError(e);
        }
    }

    public List<SampleVO> getAllSamples() {
        final List<SampleVO> res = new LinkedList<>();
        for (int i=0; i<SAMPLES_LENGTH; ++i) {
            int offset = struct.sampleOffsets[i];
            if (offset == 0) continue;
            SamplesDumpSampleStruct sample = samples[i];
            res.add(SampleVO.fromStruct(offset, sample));
        }

        return res;
    }

    public void playSound(SampleVO sample) {
        try (Clip clip = AudioSystem.getClip();
             InputStream is = sample.getAudioStream();
             AudioInputStream stream = AudioSystem.getAudioInputStream(is)
        ) {
            clip.open(stream);
            clip.start();
            clip.drain();
            Thread.currentThread().sleep(clip.getMicrosecondLength() / 1000);
        } catch (LineUnavailableException | InterruptedException | IOException | UnsupportedAudioFileException e) {
            e.printStackTrace();
        }
    }

    public int getFreeMemorySeconds() {
        return Constants.SAMPLE_MEMORY_SEC - ((source.length - Constants.SAMPLE_ALL_HEADER_SIZE) / 100000);
    }

    @Override
    public void unpack(byte[] src) {
        String signature = new String(Arrays.copyOf(src, Constants.SAMPLE_ALL_SIGNATURE.length()));
        if (!Objects.equals(Constants.SAMPLE_ALL_SIGNATURE, signature)) {
            throw new InvalidStructError("Invalid signature");
        }
        
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

    @Override
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

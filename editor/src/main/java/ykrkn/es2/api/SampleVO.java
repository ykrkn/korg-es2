package ykrkn.es2.api;

import lombok.Getter;
import lombok.Setter;
import ykrkn.es2.Category;
import ykrkn.es2.struct.SamplesDumpSampleStruct;

import javax.sound.sampled.AudioFileFormat;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

@Getter
public final class SampleVO {

    private final SamplesDumpSampleStruct struct;

    private int offset;
    private int number;
    private int absNumber;
    private String name;
    private Category category;

    @Setter
    private AudioFileFormat audioFileFormat;

    private SampleVO(SamplesDumpSampleStruct struct) {
         this.struct = struct;
    }

    public static SampleVO fromStruct(int offset, SamplesDumpSampleStruct struct) {
        SampleVO o = new SampleVO(struct);
        o.offset = offset;
        o.number = struct.number;
        o.absNumber = struct.absNumber;
        o.name = struct.name.toString();
        o.category = Category.values()[struct.category];
        return o;
    }

    public InputStream getAudioStream() {
        ByteBuffer buf = ByteBuffer.allocate(struct.riff.length + struct.dataSize + 4);
        buf.order(ByteOrder.LITTLE_ENDIAN);
        buf.put(struct.riff);
        buf.putInt(struct.dataSize);
        buf.put(struct.waveData);
        buf.flip();
        return new ByteArrayInputStream(buf.array());
    }
    
    @Override
    public String toString() {
        return "SampleVO{" +
                "offset=" + offset +
                ", number=" + number +
                ", absNumber=" + absNumber +
                ", name=" + name +
                ", category=" + category +
                ", audioFileFormat=" + audioFileFormat +
                '}';
    }
}

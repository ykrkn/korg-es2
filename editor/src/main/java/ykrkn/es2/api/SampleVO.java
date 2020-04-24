package ykrkn.es2.api;

import lombok.Getter;
import ykrkn.es2.Category;

import javax.sound.sampled.AudioFileFormat;
import javax.sound.sampled.AudioSystem;
import java.io.ByteArrayInputStream;
import java.io.InputStream;

@Getter
public final class SampleVO {

    private SamplesDumpSampleStruct struct;

    private int offset;
    private int number;
    private int absNumber;
    private String name;
    private Category category;

    private SampleVO() {}

    public static SampleVO fromStruct(int offset, SamplesDumpSampleStruct struct) {
        SampleVO o = new SampleVO();
        o.offset = offset;
        o.number = struct.number;
        o.absNumber = struct.absNumber;
        o.name = struct.name.toString();
        o.category = Category.values()[struct.category];
        return o;
    }
    
    @Override
    public String toString() {
        return "SampleVO{" +
                "offset=" + offset +
                ", number=" + number +
                ", absNumber=" + absNumber +
                ", name=" + name +
                ", category=" + category +
                '}';
    }
}

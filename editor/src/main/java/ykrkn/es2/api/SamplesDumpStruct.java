package ykrkn.es2.api;

import struct.*;
import ykrkn.es2.Constants;

import javax.sound.sampled.AudioFileFormat;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.UnsupportedAudioFileException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.nio.ByteOrder;
import java.util.Arrays;
import java.util.Objects;

@StructClass
public class SamplesDumpStruct implements Serializable {

    private static final long serialVersionUID = 1L;

    @StructField(order = 0)
    public CString signature = new CString(88);

    @StructField(order = 1)
    public int[] sampleOffsets = new int[1000];

}

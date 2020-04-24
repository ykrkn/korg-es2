package ykrkn.es2.api;

import struct.CString;
import struct.StructClass;
import struct.StructField;

import java.io.Serializable;

@StructClass
public class SamplesDumpStruct implements Serializable {

    private static final long serialVersionUID = 1L;

    @StructField(order = 0)
    public CString signature = new CString(88);

    @StructField(order = 1)
    public int[] sampleOffsets = new int[1000];

}

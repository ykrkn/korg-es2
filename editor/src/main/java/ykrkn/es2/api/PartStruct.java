package ykrkn.es2.api;

import struct.StructClass;
import struct.StructField;

import java.io.Serializable;

@StructClass
public class PartStruct implements Serializable {
    private static final long serialVersionUID = 1L;
    @StructField(order = 0) public byte[] pad = new byte[816];
}

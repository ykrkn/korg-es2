package ykrkn.es2.struct;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import struct.StructClass;
import struct.StructField;

/*
+-------------+--------------------------+--------------------------------------+
| 48~59       | Step1 Step Data          |                                      |
| (48)        | Step1 On/Off             | 0,1=Off,On                           |
| (49)        | Step1 Gate Time          | 0~96,127=0~96,TIE                    |
| (50)        | Step1 Velocity           | 1~127                                |
| (51)        | Step1 Trigger On/Off     | 0,1=Off,On                           |
| (52)        | Step1 Note Slot 1        | 0,1~128=Off,Note No 0~127            |
| (53)        | Step1 Note Slot 2        | (same as Slot 1)                     |
| (54)        | Step1 Note Slot 3        | (same as Slot 1)                     |
| (55)        | Step1 Note Slot 4        | (same as Slot 1)                     |
| (56~59)     | (reserved)               |                                      |
+-------------+--------------------------+--------------------------------------+
 */
@StructClass
public class StepStruct {
    @StructField(order = 0) public byte enabled;
    @StructField(order = 1) public byte gateTime;
    @StructField(order = 2) public byte velocity;
    @StructField(order = 3) public byte triggerEnabled;

    @StructField(order = 4)
    @JsonSerialize(using = NByteArraySerializer.class)
    public byte[] notes = new byte[4];

    @StructField(order = 5) @JsonIgnore public int pad2;
}

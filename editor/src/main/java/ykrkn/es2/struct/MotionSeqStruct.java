package ykrkn.es2.struct;

import struct.StructClass;
import struct.StructField;

import java.io.Serializable;

/*
TABLE 5 :Motion Sequence Parameter
 OFFSET : Offset in the Pattern Parameter
+-------------+--------------------------+--------------------------------------+
|  OFFSET     |    PARAMETER             | VALUE/DESCRIPTION                    |
+-------------+--------------------------+--------------------------------------+
| 0~23        | Part Slot                | 0,1~16,17=Off,Part1~16,Master FX     |
+-------------+--------------------------+--------------------------------------+
| 24~48       | Destination              | *T5-1                                |
+-------------+--------------------------+--------------------------------------+
| 49~112      | Slot 1 Motion Sequence   | 0~127 for each                       |
+-------------+--------------------------+--------------------------------------+
| .           |                                                                 |
| .           |                                                                 |
| .           |                                                                 |
+-------------+--------------------------+--------------------------------------+
| 1519~1583   | Slot 24 Motion Sequence  | 0~127                                |
+-------------+--------------------------+--------------------------------------+
 */
@StructClass
public class MotionSeqStruct implements Serializable {
    private static final long serialVersionUID = 1L;
    @StructField(order = 0) public byte[] pad = new byte[1584];
}

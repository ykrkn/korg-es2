package ykrkn.es2.struct;

import struct.StructClass;
import struct.StructField;

import java.io.Serializable;

/*
TABLE 4 : Master Fx Paramter
  OFFSET : Offset in the Pattern Parameter
+-------------+-------------------+--------------------------------------+
|  OFFSET     |    PARAMETER      | VALUE/DESCRIPTION                    |
+-------------+-------------------+--------------------------------------+
| 0           | (reseved)         |                                      |
+-------------+-------------------+--------------------------------------+
| 1           | Type              | 0~31                                 |
+-------------+-------------------+--------------------------------------+
| 2           | XY Pad X          | 0~127                                |
+-------------+-------------------+--------------------------------------+
| 3           | XY Pad Y          | 0~127                                |
+-------------+-------------------+--------------------------------------+
| 4           | (reserved)        |                                      |
+-------------+-------------------+--------------------------------------+
| 5           | MFX Hold          | 0,1~127 = OFF,ON                     |
+-------------+-------------------+--------------------------------------+
| 6~7         | (reserved)        |                                      |
+-------------+-------------------+--------------------------------------+
 */
@StructClass
public class MasterFxStruct implements Serializable {
    private static final long serialVersionUID = 1L;
    @StructField(order = 0) public byte pad1;
    @StructField(order = 1) public byte type;
    @StructField(order = 2) public byte x;
    @StructField(order = 3) public byte y;
    @StructField(order = 4) public byte pad2;
    @StructField(order = 5) public byte hold;
    @StructField(order = 6) public byte[] pad3 = new byte[2];
}

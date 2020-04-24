package ykrkn.es2.api;

import struct.StructClass;
import struct.StructField;

import java.io.Serializable;

/*
 TABLE 3 : TouchScale Parameter
  OFFSET : Offset in the Pattern Parameter
+-------------+-------------------+--------------------------------------+
|  OFFSET     |    PARAMETER      | VALUE/DESCRIPTION                    |
+-------------+-------------------+--------------------------------------+
| 0~4         | (reseved)         |                                      |
+-------------+-------------------+--------------------------------------+
| 5           | Gate Arp Pattern  | 0~49                                 |
+-------------+-------------------+--------------------------------------+
| 6           | Gate Arp Speed    | 0~127                                |
+-------------+-------------------+--------------------------------------+
| 7           | (reserved)        |                                      |
+-------------+-------------------+--------------------------------------+
| 8~9         | Gate Arp Time     | -100 ~ 100                           |
+-------------+-------------------+--------------------------------------+
| 10~15       | (reserved)        |                                      |
+-------------+-------------------+--------------------------------------+
 */

@StructClass
public class TouchScaleStruct implements Serializable {
    private static final long serialVersionUID = 1L;
    @StructField(order = 0) public byte[] pad1 = new byte[5];
    @StructField(order = 1) public byte gateArpPattern;
    @StructField(order = 2) public byte gateArpSpeed;
    @StructField(order = 3) public byte pad2;
    @StructField(order = 4) public short gateArpTime;
    @StructField(order = 5) public byte[] pad3 = new byte[6];
}

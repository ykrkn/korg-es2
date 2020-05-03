package ykrkn.es2.struct;

import struct.CString;
import struct.StructClass;
import struct.StructField;

import java.io.Serializable;

/*
TABLE 1 : Pattern Parameter ( 1 Pattern, Current Pattern )
  No. : No. in the Pattern dump data.
+-------------+-------------------+--------------------------------------+
|  No.        |    PARAMETER      | VALUE/DESCRIPTION                    |
+-------------+-------------------+--------------------------------------+
| 0~3         | Header            | 'PTST' = 54535450[HEX]               |
+-------------+-------------------+--------------------------------------+
| 4~7         | Size              |                                      |
+-------------+-------------------+--------------------------------------+
| 8~11        | (reserved)        |                                      |
+-------------+-------------------+--------------------------------------+
| Pattern Version (TABLE 2)                                              |

 TABLE 2 : Pattern Version
  OFFSET : Offset in the Pattern Parameter
+-------------+-------------------+--------------------------------------+
|  OFFSET     |    PARAMETER      | VALUE/DESCRIPTION                    |
+-------------+-------------------+--------------------------------------+
| 0           | Major version     |                                      |
+-------------+-------------------+--------------------------------------+
| 1           | Minor version     |                                      |
+-------------+-------------------+--------------------------------------+
| 2~3         | (reserved)        |                                      |
+-------------+-------------------+--------------------------------------+


+-------------+-------------------+--------------------------------------+
| 16~33       | Pattern Name      | null terminated                      |
+-------------+-------------------+--------------------------------------+
| 34~35       | Tempo             | 200~3000 = 20.0 ~ 300.0              |
+-------------+-------------------+--------------------------------------+
| 36          | Swing             | -48 ~ 48                             |
+-------------+-------------------+--------------------------------------+
| 37          | Length            | 0~3 = 1~4bar(s)                      |
+-------------+-------------------+--------------------------------------+
| 38          | Beat              | 0, 1, 2, 3 = 16,32,8 Tri, 16 Tri     |
+-------------+-------------------+--------------------------------------+
| 39          | Key               | 0~11 = C~B                           |
+-------------+-------------------+--------------------------------------+
| 40          | Scale             | 0~35                                 |
+-------------+-------------------+--------------------------------------+
| 41          | Chordset          | 0~4                                  |
+-------------+-------------------+--------------------------------------+
| 42          | Play Level        | 127 ~ 0 = 0 ~ 127                    |
+-------------+-------------------+--------------------------------------+
| 43          | (reserved)                                               |
+-------------+-------------------+--------------------------------------+
|  TouchScale Parameter (TABLE 3)                                        |
+-------------+-------------------+--------------------------------------+
|  Master Fx Paramter (TABLE 4)                                          |
+-------------+-------------------+--------------------------------------+
| 68          | Alternate 13-14   | 0~1=OFF,ON                           |
+-------------+-------------------+--------------------------------------+
| 69          | Alternate 15-16   | 0~1=OFF,ON                           |
+-------------+----------------------------------------------------------+
| 70~77       | (reserved)                                               |
+-------------+----------------------------------------------------------+
| 78~255      | (reserved)                                               |
+-------------+----------------------------------------------------------+
|  Motion Sequence Parameter (TABLE 5)                                   |
+-------------+-------------------+--------------------------------------+
| 1840~2047   | (reserved)                                               |
+-------------+-------------------+--------------------------------------+
| 2048~2863   | Part 1 Parameter (TABLE 6)                               |
+-------------+-------------------+--------------------------------------+
| .           |                                                          |
| .           |                                                          |
| .           |                                                          |
+-------------+-------------------+--------------------------------------+
| 14288~15103 | Part 16 Parameter (TABLE 6)                              |
+-------------+-------------------+--------------------------------------+
| 15104~15355 | (reserved)                                               |
+-------------+-------------------+--------------------------------------+
| 15356~15359 | Footer            | 'PTED' = 44455450[HEX]               |
+-------------+-------------------+--------------------------------------+
| 15360~16383 | (reserved)                                               |
+-------------+-------------------+--------------------------------------+
*/

@StructClass
public class PatternStruct implements Serializable {

    private static final long serialVersionUID = 1L;

    // 'PTST' = 54535450[HEX]
    @StructField(order = 0)  public int header;
    @StructField(order = 1)  public int size;
    @StructField(order = 2)  public int pad1;
    @StructField(order = 3)  public int version;
    @StructField(order = 4)  public CString name = new CString(18);
    @StructField(order = 5)  public short tempo;
    @StructField(order = 6)  public byte swing;
    @StructField(order = 7)  public byte length;
    @StructField(order = 8)  public byte beat;
    @StructField(order = 9)  public byte key;
    @StructField(order = 10) public byte scale;
    @StructField(order = 11) public byte chordset;
    @StructField(order = 12) public byte level;
    @StructField(order = 13) public byte pad2;
    
    @StructField(order = 14) public TouchScaleStruct touchScale = new TouchScaleStruct();
    @StructField(order = 15) public MasterFxStruct masterFx = new MasterFxStruct();
    @StructField(order = 16) public byte alt1314;
    @StructField(order = 17) public byte alt1516;
    @StructField(order = 18) public byte[] pad3 = new byte[186];
    @StructField(order = 19) public MotionSeqStruct motionSeq = new MotionSeqStruct();
    @StructField(order = 20) public byte[] pad4 = new byte[208];

    @StructField(order = 21)
    public PartStruct[] parts = new PartStruct[] {
            new PartStruct(), new PartStruct(), new PartStruct(), new PartStruct(),
            new PartStruct(), new PartStruct(), new PartStruct(), new PartStruct(),
            new PartStruct(), new PartStruct(), new PartStruct(), new PartStruct(),
            new PartStruct(), new PartStruct(), new PartStruct(), new PartStruct()
    };

    @StructField(order = 22)
    public byte[] pad5 = new byte[252];

    @StructField(order = 23)
    // 'PTED' = 44455450[HEX]
    public int footer;

    public void validate() {
        if (header != 0x54535450) throw new InvalidStructError("Invalid header");
        if (footer != 0x44455450) throw new InvalidStructError("Invalid footer");
    }

    @Override
    public String toString() {
        return "PatternStruct{" +
                "name=" + name.toString() +
                ", tempo=" + tempo +
                ", swing=" + swing +
                ", length=" + length +
                ", beat=" + beat +
                ", key=" + key +
                ", scale=" + scale +
                ", chordset=" + chordset +
                ", level=" + level +
                '}';
    }
}

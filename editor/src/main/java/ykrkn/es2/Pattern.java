package ykrkn.es2;

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
+-------------+-------------------+--------------------------------------+
|  Master Fx Paramter (TABLE 4)                                          |

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

public class Pattern {

    Parameter[] parameters = new Parameter[] {
        Parameter.stringParameter("header", 0, 4),
        Parameter.intParameter("size", 4),
        Parameter.byteArrayParameter("version", 12, 2),
        Parameter.stringParameter("patternName", 16, 17),
        Parameter.shortParameter("tempo10x", 34),
        Parameter.byteParameter("swing", 36),
        Parameter.byteParameter("length", 37),
        Parameter.byteParameter("beat", 38),
        Parameter.byteParameter("key", 39),
        Parameter.byteParameter("scale", 40),
        Parameter.byteParameter("chordset", 41),
        Parameter.byteParameter("playLevel", 42),

        // touch scale offset = 44
        Parameter.byteParameter("gateArpPattern", 44+5),
        Parameter.byteParameter("gateArpSpeed", 44+6),
        // TODO: check gateArpTime! should be -100 ~ 100
        Parameter.shortParameter("gateArpTime", 44+8),

        // Master Fx offset = 60
        Parameter.byteParameter("masterFxType", 61),
        Parameter.byteParameter("masterFxPadX", 62),
        Parameter.byteParameter("masterFxPadY", 63),
        Parameter.byteParameter("masterFxHold", 65),
        Parameter.byteParameter("alt1314", 68),
        Parameter.byteParameter("alt1516", 69),
        // TODO: motion seq here
        Parameter.stringParameter("footer", 15356, 4)
    };

    Part[] parts = new Part[Constants.PARTS_COUNT];

    public void readFromByteArray(byte[] data) {
        for (Parameter parameter : parameters) {
            parameter.readFromSource(data);
        }

//        // parts
//        for (int i = 0; i < Constants.PARTS_COUNT; i++) {
//            byte[] partBA = new byte[Constants.PART_BLOCK_SIZE];
//            buffer.get(partBA);
//            ByteBuffer partBuffer = ByteBuffer.wrap(partBA);
//            Part p = new Part(i);
//            p.readFromBuffer(partBuffer);
//            parts[i] = p;
//        }
//


        //        if(!Constants.PATTERN_HEADER.equals(header)) {
//            throw new RuntimeException("Invalid patter block header " + header);
//        }

//        if(!Constants.PATTERN_FOOTER.equals(footer)) {
//            throw new RuntimeException("Invalid pattern block footer " + footer);
//        }

    }

    @Override
    public String toString() {
        return "Pattern{" +
                ", patternName='" + parameters[3] + '\'' +
                ", tempo10x=" + parameters[4] +
                ", length=" + parameters[6] +
                '}';
    }


}

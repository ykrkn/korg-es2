package com.ykrkn.electribe;

import java.nio.ByteBuffer;
import java.util.Arrays;

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

public class Pattern extends ESObject {
    int size;
    byte[] version;
    String patternName;
    short tempo10x;
    byte swing;
    byte length;
    byte beat;
    byte key;
    byte scale;
    byte chordset;
    byte playLevel;

    byte gateArpPattern;
    byte gateArpSpeed;
    short gateArpTime;

    byte masterFxType;
    byte masterFxPadX;
    byte masterFxPadY;
    byte masterFxHold;
    byte alt1314;
    byte alt1516;
    Part[] parts = new Part[Constants.PARTS_COUNT];

    void readFromBuffer(ByteBuffer buffer) {
        this.buffer = buffer;
        buffer.rewind();

        String header = new String(read(0, 3));
        if(!Constants.PATTERN_HEADER.equals(header)) {
            throw new RuntimeException("Invalid patter block header " + header);
        }

        size = bytea2int(read(4, 7));
        read(8, 11);
        version = read(12, 13);
        read(14, 15);
        patternName = bytea2str(read(16, 33));
        tempo10x = bytea2short(read(34, 35));
        swing = readByte(36);
        length = readByte(37);
        beat = readByte(38);
        key = readByte(39);
        scale = readByte(40);
        chordset = readByte(41);
        playLevel = readByte(42);
        readByte(43);

        // touch scale
        int off = buffer.position();
        read(off, off+4);
        gateArpPattern = readByte(off+5);
        gateArpSpeed = readByte(off+6);
        readByte(off+7);
        // TODO: check gateArpTime! should be -100 ~ 100
        gateArpTime = bytea2short(read(off+8, off+9));
        read(off+10, off+15);

        // Master Fx
        off = buffer.position();
        readByte(off);
        masterFxType = readByte(off+1);
        masterFxPadX = readByte(off+2);
        masterFxPadY = readByte(off+3);
        readByte(off+4);
        masterFxHold = readByte(off+5);
        read(off+6, off+7);

        alt1314 = readByte(68);
        alt1516 = readByte(69);
        read(70, 77);
        read(78, 255);

        // TODO: motion seq here
        off = buffer.position();
        read(off, off+1583);

        read(1840, 2047);

        // parts
        for (int i = 0; i < Constants.PARTS_COUNT; i++) {
            byte[] partBA = new byte[Constants.PART_BLOCK_SIZE];
            buffer.get(partBA);
            ByteBuffer partBuffer = ByteBuffer.wrap(partBA);
            Part p = new Part(i);
            p.readFromBuffer(partBuffer);
            parts[i] = p;
        }

        read(15104, 15355);
        String footer = new String(read(15356, 15359));
        if(!Constants.PATTERN_FOOTER.equals(footer)) {
            throw new RuntimeException("Invalid pattern block footer " + footer);
        }
        read(15360, 16383);
    }

    @Override
    public String toString() {
        return "Pattern{" +
                "size=" + size +
                ", version=" + Arrays.toString(version) +
                ", patternName='" + patternName + '\'' +
                ", tempo10x=" + tempo10x +
                ", length=" + length +
                '}';
    }
}

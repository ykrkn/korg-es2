package ykrkn.es2.struct;

import struct.StructClass;
import struct.StructField;

import java.io.Serializable;

/*
+-------------+--------------------------+--------------------------------------+
|  OFFSET     |    PARAMETER             | VALUE/DESCRIPTION                    |
+-------------+--------------------------+--------------------------------------+
| 0           | Last Step                | 0,1~15=16,1~15                       |
+-------------+--------------------------+--------------------------------------+
| 1           | Mute                     | 0,1=OFF,ON                           |
+-------------+--------------------------+--------------------------------------+
| 2           | Voice Assign             | 0,1,2,3=Mono1, Mono2, Poly1, Poly2   |
+-------------+--------------------------+--------------------------------------+
| 3           | Motion Sequence          | 0,1,2=Off, Smooth, TriggerHold       |
+-------------+--------------------------+--------------------------------------+
| 4           | Trig.Pad Velocity        | 0,1=Off,On                           |
+-------------+--------------------------+--------------------------------------+
| 5           | Scale Mode               | 0,1=Off,On                           |
+-------------+--------------------------+--------------------------------------+
| 6           | Part Priority            | 0,1=Normal,High                      |
+-------------+--------------------------+--------------------------------------+
| 7           | (reserved)               |                                      |
+-------------+--------------------------+--------------------------------------+
| 8~9         | Oscillator Type          | 0~500                                |
+-------------+--------------------------+--------------------------------------+
| 10          | (reserved)               |                                      |
+-------------+--------------------------+--------------------------------------+
| 11          | Oscillator Edit          | 0~127                                |
+-------------+--------------------------+--------------------------------------+
| 12          | Filter Type              | 0~16                                 |
+-------------+--------------------------+--------------------------------------+
| 13          | Filter Cutoff            | 0~127                                |
+-------------+--------------------------+--------------------------------------+
| 14          | Filter Resonance         | 0~127                                |
+-------------+--------------------------+--------------------------------------+
| 15          | Filter EG Int.           | -63~63                               |
+-------------+--------------------------+--------------------------------------+
| 16          | Modulation Type          | 0~71                                 |
+-------------+--------------------------+--------------------------------------+
| 17          | Modulation Speed         | 0~127                                |
+-------------+--------------------------+--------------------------------------+
| 18          | Modulation Depth         | 0~127                                |
+-------------+--------------------------+--------------------------------------+
| 19          | (reserved)               |                                      |
+-------------+--------------------------+--------------------------------------+
| 20          | EG Attack                | 0~127                                |
+-------------+--------------------------+--------------------------------------+
| 21          | EG Decay/Release         | 0~127                                |
+-------------+--------------------------+--------------------------------------+
| 22~23       | (reserved)               |                                      |
+-------------+--------------------------+--------------------------------------+
| 24          | Amp Level                | 0~127                                |
+-------------+--------------------------+--------------------------------------+
| 25          | Amp Pan                  | -63~0~64=L63~center~R63              |
+-------------+--------------------------+--------------------------------------+
| 26          | EG On/Off                | 0,1=Off,On                           |
+-------------+--------------------------+--------------------------------------+
| 27          | MFX Send On/Off          | 0,1=Off,On                           |
+-------------+--------------------------+--------------------------------------+
| 28          | Groove Type              | 0~24                                 |
+-------------+--------------------------+--------------------------------------+
| 29          | Groove Depth             | 0~127                                |
+-------------+--------------------------+--------------------------------------+
| 30~31       | (reserved)               |                                      |
+-------------+--------------------------+--------------------------------------+
| 32          | IFX On/Off               | 0,1=Off,On                           |
+-------------+--------------------------+--------------------------------------+
| 33          | IFX Type                 | 0~37                                 |
+-------------+--------------------------+--------------------------------------+
| 34          | IFX Edit                 | 0~127                                |
+-------------+--------------------------+--------------------------------------+
| 35          | (reserved)               |                                      |
+-------------+--------------------------+--------------------------------------+
| 36          | Oscillator Pitch         | -63~+63                              |
+-------------+--------------------------+--------------------------------------+
| 37          | Oscillator Glide         | 0~127                                |
+-------------+--------------------------+--------------------------------------+
| 38~47       | (reserved)               |                                      |
+-------------+--------------------------+--------------------------------------+
| 48~59       | Step1 Step Data          |                                      |
+-------------+--------------------------+--------------------------------------+
| 60~71       | Step2 Step Data          | (same as Step1 Step Data)            |
+-------------+--------------------------+--------------------------------------+
| .           |                                                                 |
| .           |                                                                 |
| .           |                                                                 |
+-------------+--------------------------+--------------------------------------+
| 741~752     | Step64 Step Data         | (same as Step1 Step Data)            |
+-------------+--------------------------+--------------------------------------+
 */

@StructClass  // 816 bytes
public class PartStruct implements Serializable {
    private static final long serialVersionUID = 1L;

    @StructField(order = 0)  public byte lastStep;
    @StructField(order = 1)  public byte mute;
    @StructField(order = 2)  public byte voiceAssign;
    @StructField(order = 3)  public byte motionSeq;
    @StructField(order = 4)  public byte padVelocity;
    @StructField(order = 5)  public byte scaleMode;
    @StructField(order = 6)  public byte priority;
    @StructField(order = 7)  public byte pad1;
    @StructField(order = 8)  public short oscType;
    @StructField(order = 9)  public byte pad2;
    @StructField(order = 10) public byte oscEdit;
    @StructField(order = 11) public byte filterType;
    @StructField(order = 12) public byte filterCutoff;
    @StructField(order = 13) public byte filterReso;
    @StructField(order = 14) public byte filterEGInt;
    @StructField(order = 15) public byte modType;
    @StructField(order = 16) public byte modSpeed;
    @StructField(order = 17) public byte modDepth;
    @StructField(order = 18) public byte pad3;
    @StructField(order = 19) public byte EGAttack;
    @StructField(order = 20) public byte EGDecRel;
    @StructField(order = 21) public short pad4;
    @StructField(order = 22) public byte ampLevel;
    @StructField(order = 23) public byte ampPan;
    @StructField(order = 24) public byte EGEnabled;
    @StructField(order = 25) public byte MFXEnabled;
    @StructField(order = 26) public byte grooveType;
    @StructField(order = 27) public byte grooveDepth;
    @StructField(order = 28) public short pad5;
    @StructField(order = 29) public byte IFXEnabled;
    @StructField(order = 30) public byte IFXType;
    @StructField(order = 31) public byte IFXEdit;
    @StructField(order = 32) public byte pad6;
    @StructField(order = 33) public byte oscPitch;
    @StructField(order = 34) public byte oscGlide;
    @StructField(order = 35) public byte[] pad7 = new byte[10];

    @StructField(order = 36) public StepStruct[] steps = new StepStruct[64];

    public PartStruct() {
        for (int i = 0; i < steps.length; i++) {
            steps[i] = new StepStruct();
        }
    }
}

package ykrkn.es2;

import java.nio.ByteBuffer;

/*
TABLE 6 :Part Parameter
 OFFSET : Offset in the Pattern Parameter
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
| 60~71       | Step2 Step Data          | (same as Step1 Step Data)            |
+-------------+--------------------------+--------------------------------------+
| .           |                                                                 |
| .           |                                                                 |
| .           |                                                                 |
+-------------+--------------------------+--------------------------------------+
| 741~752     | Step64 Step Data         | (same as Step1 Step Data)            |
+-------------+--------------------------+--------------------------------------+
*/
public class Part {

    int index;
    byte lastStep;
    byte mute;
    byte voiceAssign;
    byte motionSeq;
    byte triggerPadVelocity;
    byte scaleMode;
    byte partPriority;
    short oscType;
    byte oscEdit;
    byte filterType;
    byte filterCutoff;
    byte filterReso;
    byte filterEGint;
    byte modulationType;
    byte modulationSpeed;
    byte modulationDepth;
    byte EGAttack;
    byte EGDecay;
    byte ampLevel;
    byte ampPan;
    byte EGEnabled;
    byte MFXSendEnabled;
    byte grooveType;
    byte grooveDepth;
    byte IFXEnabled;
    byte IFXType;
    byte IFXEdit;
    byte oscPitch;
    byte oscGlide;
    Step[] steps = new Step[Constants.STEPS_COUNT];

    // Dirty Stub
    private ByteBuffer buffer;

    // Dirty Stub
    private void read(int i, int i1) {

    }

    // Dirty Stub
    private byte readByte(int i) {
        return 0;
    }

    Part(int index) {
        this.index = index;
    }
    
    void readFromBuffer(ByteBuffer buffer) {
        this.buffer = buffer;

        lastStep = readByte(0);
        mute = readByte(1);
        voiceAssign = readByte(2);
        motionSeq = readByte(3);
        triggerPadVelocity = readByte(4);
        scaleMode = readByte(5);
        partPriority = readByte(6);
        readByte(7);
        oscType = 0;// FIXME:read(8, 9);
        readByte(10);
        oscEdit = readByte(11);
        filterType = readByte(12);
        filterCutoff = readByte(13);
        filterReso = readByte(14);
        filterEGint = readByte(15);
        modulationType = readByte(16);
        modulationSpeed = readByte(17);
        modulationDepth = readByte(18);
        readByte(19);
        EGAttack = readByte(20);
        EGDecay = readByte(21);
        read(22, 23);
        ampLevel = readByte(24);
        ampPan = readByte(25);
        EGEnabled = readByte(26);
        MFXSendEnabled = readByte(27);
        grooveType = readByte(28);
        grooveDepth = readByte(29);
        read(30, 31);
        IFXEnabled = readByte(32);
        IFXType = readByte(33);
        IFXEdit = readByte(34);
        readByte(35);
        oscPitch = readByte(36);
        oscGlide = readByte(37);
        read(38, 47);

        // steps
        for (int i = 0; i < Constants.STEPS_COUNT; i++) {
            Step item = new Step(i);
            item.readFromBuffer(buffer);
            steps[i] = item;
        }
    }

    @Override
    public String toString() {
        return "Part{" +
                "oscType=" + oscType +
                ", ampLevel=" + ampLevel +
                ", ampPan=" + ampPan +
                '}';
    }
}

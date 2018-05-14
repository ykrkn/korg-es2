package com.ykrkn.electribe;

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

import java.nio.ByteBuffer;
import java.util.Arrays;

public class Step extends ESObject {

    final int index;

    byte enabled;
    byte gateTime;
    byte velocity;
    byte triggerEnabled;
    byte[] notes = new byte[4];

    public Step(int index) {
        this.index = index;
    }

    @Override
    void readFromBuffer(ByteBuffer buffer) {
        enabled = buffer.get();
        gateTime = buffer.get();
        velocity = buffer.get();
        triggerEnabled = buffer.get();
        notes[0] = buffer.get();
        notes[1] = buffer.get();
        notes[2] = buffer.get();
        notes[3] = buffer.get();
        buffer.get();
        buffer.get();
        buffer.get();
        buffer.get();
    }

    @Override
    public String toString() {
        return "Step{" +
                "enabled=" + enabled +
                ", velocity=" + velocity +
                ", notes=" + Arrays.toString(notes) +
                '}';
    }
}

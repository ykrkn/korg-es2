package ykrkn.es2.midi;

import javax.sound.midi.MidiMessage;

@FunctionalInterface
public interface MidiSubscriber {
    int CHANNEL = 1;
    int SYSEX = 2;
    int REALTIME = 4;

    void onMessage(MidiMessage message);

    default int statusFilter() {
        return CHANNEL | SYSEX | REALTIME;
    }
}

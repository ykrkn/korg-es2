package ykrkn.es2.midi;

import javax.sound.midi.MidiMessage;

@FunctionalInterface
public interface MidiSubscriber {

    void onMessage(MidiMessage message);
}

package ykrkn.es2;

import javax.sound.midi.MidiMessage;

@FunctionalInterface
public interface MidiSubscriber {

    void onMessage(MidiMessage message);
}

package ykrkn.es2.midi;

import javax.sound.midi.InvalidMidiDataException;
import javax.sound.midi.MidiMessage;
import javax.sound.midi.ShortMessage;
import javax.sound.midi.SysexMessage;

public final class Messages {

    public static MidiMessage sysex(byte[] data) {
        try {
            byte[] a = new byte[data.length+2];
            a[0] = (byte) SysexMessage.SYSTEM_EXCLUSIVE;
            for (int i = 0; i < data.length; i++) {
                a[i+1] = data[i];
            }
            a[a.length-1] = (byte) ShortMessage.END_OF_EXCLUSIVE;
            return new SysexMessage(a, a.length);
        } catch (InvalidMidiDataException e) {
            throw new InvalidMessage(e);
        }
    }

    public static MidiMessage sysex(int ... data) {
        try {
            byte[] a = new byte[data.length+2];
            a[0] = (byte) SysexMessage.SYSTEM_EXCLUSIVE;
            for (int i = 0; i < data.length; i++) {
                a[i+1] = (byte) data[i];
            }
            a[a.length-1] = (byte) ShortMessage.END_OF_EXCLUSIVE;
            return new SysexMessage(a, a.length);
        } catch (InvalidMidiDataException e) {
            throw new InvalidMessage(e);
        }
    }
}

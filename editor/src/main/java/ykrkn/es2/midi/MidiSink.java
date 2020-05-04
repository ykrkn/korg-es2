package ykrkn.es2.midi;

import javax.sound.midi.MidiDevice;
import javax.sound.midi.MidiMessage;
import javax.sound.midi.MidiUnavailableException;
import javax.sound.midi.Receiver;

public class MidiSink extends MidiIO {

    private Receiver rx;

    public MidiSink(MidiDevice device) {
        super(device);
    }

    public void open() {
        try {
            device.open();
            rx = device.getReceiver();
        } catch (MidiUnavailableException e) {
            e.printStackTrace();
        }
    }

    public void send(MidiMessage msg) {
        if (!device.isOpen()) open();

        if (rx == null) {
            System.out.println("RX IS NULL " + this);
            return;
        }

        System.out.println(this + " <- " + Utils.trace(msg));
        rx.send(msg, -1);
    }

    @Override
    public String toString() {
        return getDescription() + " IN" ;
    }
}

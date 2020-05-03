package ykrkn.es2;

import javax.sound.midi.MidiDevice;
import javax.sound.midi.MidiMessage;
import javax.sound.midi.MidiUnavailableException;
import javax.sound.midi.Receiver;

public class MidiSink extends MidiIO {

    private Receiver rx;

    public MidiSink(MidiDevice device, MidiFacade facade) {
        super(device, facade);
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
        rx.send(msg, -1);
    }

    @Override
    public String toString() {
        return device.getDeviceInfo().getDescription() + " IN" ;
    }
}

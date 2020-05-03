package ykrkn.es2.midi;

import javax.sound.midi.*;

public class MidiSource extends MidiIO {

    MidiSubscriber subscriber;

    public MidiSource(MidiDevice device, MidiFacade facade) {
        super(device, facade);
    }

    public void open() {
        try {
            device.open();
            Transmitter transmitter = device.getTransmitter();
            transmitter.setReceiver(new MidiInputReceiver());
        } catch (MidiUnavailableException e) {
            e.printStackTrace();
        }
    }

    public void subscribe(MidiSubscriber subscriber) {
        // TODO: remove previous
        this.subscriber = subscriber;
        if (!device.isOpen()) open();
    }

    private final class MidiInputReceiver implements MidiDeviceReceiver {

        public void send(MidiMessage msg, long timeStamp) {
            // TODO: clock is here
            if (msg.getMessage()[0] == -8) return;
            System.out.println(MidiSource.this + " -> " + Utils.trace(msg));
            subscriber.onMessage(msg);
        }

        public void close() {}

        @Override
        public MidiDevice getMidiDevice() {
            return device;
        }
    }

    @Override
    public String toString() {
        return getDescription() + " OUT" ;
    }
}

package ykrkn.es2.midi;

import javax.sound.midi.*;

public class MidiSource extends MidiIO {

    MidiSubscriber subscriber;

    public MidiSource(MidiDevice device) {
        super(device);
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
        // TODO: remove previous if any or throw?
        this.subscriber = subscriber;
        if (!device.isOpen()) open();
    }

    public void unsubscribe() {
        this.subscriber = new NullSubscriber();
    }

    private final class MidiInputReceiver implements MidiDeviceReceiver {

        public void send(MidiMessage msg, long timeStamp) {
            int status = Byte.toUnsignedInt(msg.getMessage()[0]);
            int filter = subscriber.statusFilter();
            // TODO: filter by status
            if (status == 248) return;
            //if ((status & 0xF8) == 0xF8 && 0 == (filter & MidiSubscriber.REALTIME)) return;
            //else if (status == 0xF0 && 0 == (filter & MidiSubscriber.SYSEX)) return;
            //else if ((status & 0x70 >> 4) <= 6 && 0 == (filter & MidiSubscriber.CHANNEL)) return;

            System.out.println(MidiSource.this + " -> " + Utils.trace(msg));
            subscriber.onMessage(msg);
        }

        public void close() {}

        @Override
        public MidiDevice getMidiDevice() {
            return device;
        }

    }

    private static final class NullSubscriber implements MidiSubscriber {
        @Override public void onMessage(MidiMessage message) {}
        @Override public int statusFilter() { return 0; }
    }

    @Override
    public String toString() {
        return getDescription() + " OUT" ;
    }
}

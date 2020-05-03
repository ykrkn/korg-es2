package ykrkn.es2;

import javax.sound.midi.MidiDevice;

abstract class MidiIO {

    protected final MidiDevice device;

    protected final MidiFacade facade;

    public MidiDevice getDevice() {
        return device;
    }

    protected MidiIO(MidiDevice device, MidiFacade facade) {
        this.device = device;
        this.facade = facade;
    }

    public String getDescription() {
        return device.getDeviceInfo().getDescription();
    }

    public abstract void open();
}

package ykrkn.es2.midi;

import javax.sound.midi.MidiDevice;

abstract class MidiIO {

    protected final MidiDevice device;

    public MidiDevice getDevice() {
        return device;
    }

    protected MidiIO(MidiDevice device) {
        this.device = device;
    }

    public String getDescription() {
        return device.getDeviceInfo().getDescription();
    }

    public abstract void open();
}

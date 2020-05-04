package ykrkn.es2.midi;

import uk.co.xfactorylibrarians.coremidi4j.CoreMidiDeviceProvider;
import uk.co.xfactorylibrarians.coremidi4j.CoreMidiException;

import javax.sound.midi.MidiDevice;
import javax.sound.midi.MidiSystem;
import javax.sound.midi.MidiUnavailableException;
import java.util.Objects;
import java.util.stream.Stream;

public class MidiFacade {

    private final static Object monitor = new Object();

    private static volatile MidiFacade instance;

    public static MidiFacade start() throws MidiSystemException {
        synchronized (monitor) {
            try {
                if (instance == null) {
                    instance = new MidiFacade();
                    instance.startImpl();
                    instance.watchMidi();
                }
                return instance;
            } catch (CoreMidiException e) {
                throw new MidiSystemException(e);
            }
        }
    }

    private void watchMidi() throws CoreMidiException {
        CoreMidiDeviceProvider.addNotificationListener(() -> System.out.println("The MIDI environment has changed."));
    }

    private void startImpl() {
        getAvailableDevices().map(Utils::trace).forEach(System.out::println);
    }

    private Stream<MidiDevice> getAvailableDevices() {
        return Stream.of(CoreMidiDeviceProvider.getMidiDeviceInfo()).map(info -> {
            try {
                return MidiSystem.getMidiDevice(info);
            } catch (MidiUnavailableException e) {
                e.printStackTrace();
                return null;
            }
        }).filter(Objects::nonNull);
    }

    public Stream<MidiSink> getSinks() {
        return getAvailableDevices()
                .filter(device -> device.getMaxReceivers() != 0)
                .map(device -> new MidiSink(device));
    }

    public Stream<MidiSource> getSources() {
        return getAvailableDevices()
                .filter(device -> device.getMaxTransmitters() != 0)
                .map(device -> new MidiSource(device));
    }

    public MidiSource findSource(String description) {
        return getSources()
                .filter(d -> d.getDevice().getDeviceInfo().getDescription().equals(description))
                .findAny().orElse(null);
    }

    public MidiSink findSink(String description) {
        return getSinks()
                .filter(d -> d.getDevice().getDeviceInfo().getDescription().equals(description))
                .findAny().orElse(null);
    }

}

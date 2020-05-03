package ykrkn.es2;

import javax.sound.midi.MidiDevice;
import javax.sound.midi.MidiMessage;
import javax.sound.midi.MidiSystem;
import javax.sound.midi.MidiUnavailableException;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Stream;

public class MidiFacade {

    final static ExecutorService exec = Executors.newCachedThreadPool();

    private final Set<MidiIO> io = new HashSet<>();

    public static MidiFacade start() throws MidiUnavailableException {
        final MidiFacade instance = new MidiFacade();
        MidiDevice.Info[] infos = MidiSystem.getMidiDeviceInfo();
        for (int i = 0; i < infos.length; i++) {
            MidiDevice.Info info = infos[i];
            System.out.println("==============");
            System.out.println(info.getVendor());
            System.out.println(info.getName());
            System.out.println(info.getDescription());
            System.out.println(info.getClass());

            MidiDevice device = MidiSystem.getMidiDevice(info);
            System.out.println(device.getMaxReceivers());
            System.out.println(device.getMaxTransmitters());

            if (device.getMaxTransmitters() != 0) {
                instance.io.add(new MidiSource(device, instance));
            }

            if (device.getMaxReceivers() != 0) {
                instance.io.add(new MidiSink(device, instance));
            }
        }
        return instance;
    }

    public Stream<MidiSink> getSinks() {
        return io.stream()
                .filter(e -> MidiSink.class.isInstance(e))
                .map(MidiSink.class::cast);
    }

    public MidiSource findSource(String description) {
        return io.stream()
                .filter(e -> MidiSource.class.isInstance(e))
                .map(MidiSource.class::cast)
                .filter(d -> d.getDevice().getDeviceInfo().getDescription().equals(description))
                .findAny().orElse(null);
    }

    public MidiSink findSink(String description) {
        return getSinks()
                .filter(d -> d.getDevice().getDeviceInfo().getDescription().equals(description))
                .findAny().orElse(null);
    }

    public static String trace(MidiMessage message) {
        return ba2str(message.getMessage());
    }

    private static String ba2str(byte[] a) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < a.length; i++) {
            if (i == 99) {
                sb.append("...");
            } else if (i > 99 && i < a.length - 8) {
                continue;
            } else {
                sb.append(String.format("%02x", a[i])).append(' ');
            }
        }
        return sb.toString();
    }
}

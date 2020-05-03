package ykrkn.es2;

import ykrkn.es2.api.SampleService;
import ykrkn.es2.midi.*;

import javax.sound.midi.InvalidMidiDataException;
import javax.sound.midi.ShortMessage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.concurrent.Executors;

public class Main {

    public static void main(String[] args) throws Exception {
        MidiFacade midi = MidiFacade.start();
        ES2SysexService service = new ES2SysexService(midi);
        // TODO: think about ...
        service.reloadPatternWhenDeviceChanged(true);

        service.start()
                .thenCompose((code) -> service.patternDump())
                .thenAccept((pattern) -> System.out.println(pattern.toString()))
                .get();
    }

    public static void main2(String[] args) throws Exception {
        MidiFacade midi = MidiFacade.start();
        MidiSource input = midi.findSource("nanoKONTROL2 SLIDER/KNOB");
        MidiSink output = midi.findSink("nanoKONTROL2 CTRL");

        input.subscribe(msg -> {
            System.out.println(Utils.trace(msg));
            //output.send(msg);
        });

        Executors.newSingleThreadExecutor().submit(new NK2(output));
    }

    static class NK2 implements Runnable {
        private final MidiSink output;

        NK2(MidiSink out) {
            this.output = out;
        }

        final byte[][] nk2 = new byte[][] {
                new byte[] {46, 43},
                new byte[] {44},
                new byte[] {42},
                new byte[] {41},
                new byte[] {45},
                new byte[] {32,48,64},
                new byte[] {33,49,65},
                new byte[] {34,50,66},
                new byte[] {35,51,67},
                new byte[] {36,52,68},
                new byte[] {37,53,69},
                new byte[] {38,54,70},
                new byte[] {39,55,71},
        };

        byte v = 0x7F;

        @Override
        public void run() {
            try {
                while (true) {
                    for (int i = 0; i < nk2.length; i++) {
                        for (int j = 0; j < nk2[i].length; j++) {
                            ShortMessage m = new ShortMessage(ShortMessage.CONTROL_CHANGE, nk2[i][j], v);
                            output.send(m);
                        }
                        Thread.sleep(1000L/nk2.length);
                    }
                    v = (byte) (v == 0x7F ? 0 : 0x7F);
                }
            } catch (InvalidMidiDataException e) {
                Thread.currentThread().interrupt();
            } catch (InterruptedException e) {}
        }
    }

    public static void main1(String[] args) {
        try {
            SampleService service = new SampleService();
            service.initWithDump(Paths.get("/Users/sx/Desktop/e2sSample.all"));
            service.getAllSamples().forEach(e -> {
                System.out.println(e);
            });
            System.out.println(service.getFreeMemorySeconds());
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(1);
        }
    }

    public static void main0(String[] args) throws IOException {
        String filename = "/Users/sx/src/korg-es2/assets/data.bin";
        System.out.println(filename);
        Path path = Paths.get(filename);
        byte[] data = Files.readAllBytes(path);
        byte[] pdata = Arrays.copyOfRange(data,
                Constants.PATTERNS_FILE_OFFSET,
                Constants.PATTERNS_FILE_OFFSET+Constants.PATTERN_BLOCK_SIZE);

        Pattern p = new Pattern();
        p.readFromByteArray(pdata);
        System.out.println(p);
    }
}

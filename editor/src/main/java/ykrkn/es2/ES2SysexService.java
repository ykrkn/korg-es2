package ykrkn.es2;

import struct.JavaStruct;
import struct.StructClass;
import struct.StructException;
import struct.StructField;
import ykrkn.es2.api.PatternStruct;

import javax.sound.midi.MidiMessage;
import javax.sound.midi.SysexMessage;
import java.nio.ByteOrder;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

public class ES2SysexService {

    static final int KORG_SX_ID = 0x42;

    private final MidiFacade midi;

    private MidiSource source;

    private MidiSink sink;

    private int globalChannel;

    private boolean reloadPatternWhenDeviceChanged;

    public ES2SysexService(MidiFacade midi) {
        this.midi = midi;
    }

    public CompletableFuture<Boolean> start() {
        SearchDevice action = new SearchDevice();
        return action.apply();
    }

    public CompletableFuture<PatternStruct> patternDump() {
        PatternDump action = new PatternDump();
        return action.apply();
    }

    public void reloadPatternWhenDeviceChanged(boolean reloadPatternWhenDeviceChanged) {
        this.reloadPatternWhenDeviceChanged = reloadPatternWhenDeviceChanged;
    }

    /**
     * (1) CURRENT PATTERN DATA DUMP REQUEST                               R
     * +----------------+--------------------------------------------------+
     * |     Byte       |             Description                          |
     * +----------------+--------------------------------------------------+
     * | F0,42,3g,      | EXCLUSIVE HEADER                                 |
     * | 00,01,24,      | ProductID (electribe sampler)                    |
     * | 0001 0000 (10) | CURRENT PATTERN DATA DUMP REQUEST      10H       |
     * | 1111 0111 (F7) | EOX                                              |
     * +----------------+--------------------------------------------------+
     *
     * Receive this message, and transmits Func=40 or Func=24 message.
     *
     * (5) CURRENT PATTERN DATA DUMP                                     R/T
     * +----------------+--------------------------------------------------+
     * |     Byte       |             Description                          |
     * +----------------+--------------------------------------------------+
     * | F0,42,3g,      | EXCLUSIVE HEADER                                 |
     * | 00,01,24,      | ProductID (electribe sampler)                    |
     * | 0100 0000 (40) | CURRENT PATTERN DATA DUMP              40H       |
     * | 0ddd dddd (dd) | Data                         (TABLE 1, NOTE 1,3) |
     * |     :          |  :                                               |
     * | 1111 0111 (F7) | EOX                                              |
     * +----------------+--------------------------------------------------+
     *
     *  Receive this message & data, save them to Edit Buffer and transmits Func=23 or Func=24 message.
     *  Receive Func=10 message, and transmits this message & data from Edit Buffer.
     */
    private final class PatternDump implements MidiSubscriber {

        private static final int CURRENT_PATTERN_DUMP_REQ = 0x10;
        private static final int CURRENT_PATTERN_DUMP_RES = 0x40;
        private static final int DATA_LOAD_ERROR_RES = 0x24;

        private CompletableFuture future;

        private final byte[] header = new byte[] {
                ES2SysexService.KORG_SX_ID,
                (byte)(0x30 | globalChannel),
                0x00, 0x01, 0x24
        };

        CompletableFuture<PatternStruct> apply() {
            future = new CompletableFuture().orTimeout(10, TimeUnit.SECONDS);
            source.subscribe(this);
            byte[] ba = Arrays.copyOf(header, header.length+1);
            ba[ba.length-1] = CURRENT_PATTERN_DUMP_REQ;
            MidiMessage msg = Messages.sysex(ba);
            sink.send(msg);
            return future;
        }

        @Override
        public void onMessage(MidiMessage msg) {
            if (msg.getStatus() != SysexMessage.SYSTEM_EXCLUSIVE) return;
            byte[] ba = msg.getMessage();
            byte[] h = Arrays.copyOfRange(ba, 1, 6);
            if (!Arrays.equals(header, h)) return;

            if (ba[6] == DATA_LOAD_ERROR_RES) {
                future.completeExceptionally(new SysexActionError("DATA LOAD ERROR", ba[6]));
                return;
            }

            if (ba[6] != CURRENT_PATTERN_DUMP_RES) {
                future.completeExceptionally(new SysexActionError("ERROR", ba[6]));
                return;
            }

            ba = Arrays.copyOfRange(ba, 7, ba.length-1);
            ba = sysex2data(ba);
            PatternStruct p = new PatternStruct();

            try {
                JavaStruct.unpack(p, ba, ByteOrder.LITTLE_ENDIAN);
                p.validate();
                future.complete(p);
            } catch (StructException e) {
                future.completeExceptionally(e);
            }
        }

        // https://blogs.bl0rg.net/netzstaub/2008/08/14/encoding-8-bit-data-in-midi-sysex/
        byte[] sysex2data(byte[] ba) {
            byte[] data = new byte[0];
            int bits = 0;
            for (int i = 0, j = 0; i < ba.length; i++) {
                if ((i % 8) == 0) {
                    bits = ba[i];
                } else {
                    data = Arrays.copyOf(data, data.length+1);
                    data[j++] = (byte) (ba[i] | ((bits & 1) << 7));
                    bits >>= 1;
                }
            }
            return data;
        }
    }

    /**
     * 2-6 SEARCH DEVICE REQUEST
     *
     * +---------+------------------------------------------------+
     * | Byte[H] |                Description                     |
     * +---------+------------------------------------------------+
     * |   F0    | Exclusive Status                               |
     * |   42    | KORG ID  ( Manufacturers ID )                  |
     * |   50    | Search Device                                  |
     * |   00    | Request                                        |
     * |   dd    | Echo Back ID                                   |
     * |   F7    | END OF EXCLUSIVE                               |
     * +---------+------------------------------------------------+
     *
     *  Receive this message, and transmits SEARCH DEVICE REPLY message
     *
     *  1-5 SEARCH DEVICE REPLY
     *
     * +------------+----------------------------------------------+
     * | Byte[H]    |                Description                   |
     * +------------+----------------------------------------------+
     * |     F0     | Exclusive Status                             |
     * |     42     | KORG ID              ( Manufacturers ID )    |
     * |     50     | Search Device                                |
     * |     01     | Reply                                        |
     * | (0000gggg) | gggg:MIDI Global Channel  ( Device ID )      |
     * |     dd     | Echo Back ID                                 |
     * |     24     | electribe sampler ID ( Family ID   (LSB))    |
     * |     01     |                      ( Family ID   (MSB))    |
     * |     01 FIXD 00                    ( Member ID   (LSB))    |
     * |     00     |                      ( Member ID   (MSB))    |
     * |     xx     |                      ( Major Ver.       )    |
     * |     xx     |                      ( Minor Ver.       )    |
     * |     xx     |                      ( Release Ver.     )    |
     * |     xx     |                      ( reserved         )    |
     * |     F7     | END OF EXCLUSIVE                             |
     * +------------+----------------------------------------------+
     */
    private final class SearchDevice {

        private static final int SEARCH_DEVICE_FUNC = 0x50;

        private static final int SEARCH_DEVICE_REQ  = 0x00;

        private static final int SEARCH_DEVICE_RES  = 0x01;

        final Map<Integer, MidiSink> echo2sink = new HashMap<>();

        private CompletableFuture future;

        private CompletableFuture apply() {
            future = new CompletableFuture().orTimeout(10, TimeUnit.SECONDS);

            midi.getSources().forEach(source -> {
                source.subscribe(msg -> {
                    try {
                        if (msg.getStatus() != SysexMessage.SYSTEM_EXCLUSIVE) return;
                        byte[] data = msg.getMessage();
                        if (data[1] != ES2SysexService.KORG_SX_ID) return;
                        if (data[2] != SEARCH_DEVICE_FUNC) return;
                        if (data[3] != SEARCH_DEVICE_RES) return;
                        SearchDeviceResponseStruct s = new SearchDeviceResponseStruct();
                        JavaStruct.unpack(s, Arrays.copyOfRange(data, 4, data.length-1));

                        if (s.es2id != SearchDeviceResponseStruct.ES2_ID) return;

                        MidiSink sink = echo2sink.get(Byte.toUnsignedInt(s.echo));

                        if (sink == null) {
                            future.completeExceptionally(new RuntimeException("Sink NOT Found " + s));
                        }

                        ES2SysexService.this.source = source;
                        ES2SysexService.this.sink = sink;
                        ES2SysexService.this.globalChannel = Byte.toUnsignedInt(s.channel);

                        future.complete(true);
                    } catch (StructException e) {
                        future.completeExceptionally(e);
                    }
                });
            });

            midi.getSinks().forEach(sink -> {
                int echo = (int)(127 * Math.random());
                echo2sink.put(echo, sink);
                MidiMessage msg = Messages.sysex(ES2SysexService.KORG_SX_ID, SEARCH_DEVICE_FUNC, SEARCH_DEVICE_REQ, echo);
                sink.send(msg);
            });

            return future;
        }
    }

    @StructClass
    public static class SearchDeviceResponseStruct {
        static final int ES2_ID  = 0x24010000;

        @StructField(order = 0) public byte channel;
        @StructField(order = 1) public byte echo;
        @StructField(order = 2) public int es2id;
        @StructField(order = 3) public byte[] version = new byte[3];
    }
}

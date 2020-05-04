package ykrkn.es2.midi;

import reactor.core.publisher.Mono;
import struct.JavaStruct;
import struct.StructClass;
import struct.StructException;
import struct.StructField;
import ykrkn.es2.struct.PatternStruct;

import javax.sound.midi.MidiMessage;
import javax.sound.midi.SysexMessage;
import java.nio.ByteOrder;
import java.time.Duration;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

public class ES2SysexService {

    private final MidiFacade midi;

    private MidiSource currentSource;

    private MidiSink currentSink;

    private int globalChannel;

    public ES2SysexService(MidiFacade midi) {
        this.midi = midi;
    }

    public Mono<Boolean> start() {
        SearchDevice action = new SearchDevice();
        return action.request();
    }

    public Mono<PatternStruct> patternDump() {
        PatternDump action = new PatternDump();
        return action.request();
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
    private final class PatternDump implements SysexExchange<PatternStruct>, MidiSubscriber {

        private CompletableFuture future;

        private final byte[] header = Utils.byteArray()
                .append(Constants.SYSTEM_EXCLUSIVE)
                .append(Constants.KORG_SX_ID)
                .append(0x30 | globalChannel)
                .append(new byte[]{0x00, 0x01, 0x24})
                .build();

        @Override
        public Mono<PatternStruct> request() {
            future = new CompletableFuture();
            currentSource.subscribe(this);

            byte[] ba = Utils.byteArray(header)
                    .append(Constants.CURRENT_PATTERN_DUMP_REQ)
                    .append(Constants.END_OF_EXCLUSIVE)
                    .build();

            MidiMessage msg = Utils.message(ba);
            currentSink.send(msg);
            return Mono.fromFuture(future);
        }

        @Override
        public void onMessage(MidiMessage msg) {
            if (msg.getStatus() != SysexMessage.SYSTEM_EXCLUSIVE) return;
            byte[] ba = msg.getMessage();
            byte[] h = Arrays.copyOfRange(ba, 1, 6);
            if (!Arrays.equals(header, h)) return;

            if (ba[6] == Constants.DATA_LOAD_ERROR_RES) {
                future.completeExceptionally(new SysexActionError("DATA LOAD ERROR", ba[6]));
                return;
            }

            if (ba[6] != Constants.CURRENT_PATTERN_DUMP_RES) {
                future.completeExceptionally(new SysexActionError("ERROR", ba[6]));
                return;
            }

            ba = Arrays.copyOfRange(ba, 7, ba.length-1);
            ba = Utils.sysex2data(ba);
            PatternStruct p = new PatternStruct();

            try {
                JavaStruct.unpack(p, ba, ByteOrder.LITTLE_ENDIAN);
                p.validate();
                future.complete(p);
            } catch (StructException e) {
                future.completeExceptionally(e);
            }
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
    private final class SearchDevice implements SysexExchange<Boolean> {

        final Map<Integer, MidiSink> echo2sink = new HashMap<>();

        final CompletableFuture<Boolean> future;

        private byte[] header = Utils.byteArray()
                .append(Constants.SYSTEM_EXCLUSIVE)
                .append(Constants.KORG_SX_ID)
                .append(Constants.SEARCH_DEVICE_FUNC)
                .append(Constants.SEARCH_DEVICE_REQ)
                .build();

        private SearchDevice() {
            future = new CompletableFuture<>();
            subscribeAllSources();
        }

        private void subscribeAllSources() {
            midi.getSources().forEach(source -> source.subscribe(msg -> {
                try {
                    if (msg.getStatus() != SysexMessage.SYSTEM_EXCLUSIVE) {
                        return;
                    }

                    byte[] data = msg.getMessage();

                    if (data[1] != Constants.KORG_SX_ID
                            ||  data[2] != Constants.SEARCH_DEVICE_FUNC
                            ||  data[3] != Constants.SEARCH_DEVICE_RES
                    ) {
                        return;
                    }

                    SearchDeviceResponseStruct s = new SearchDeviceResponseStruct();
                    JavaStruct.unpack(s, Arrays.copyOfRange(data, 4, data.length-1));

                    if (s.es2id != SearchDeviceResponseStruct.ES2_ID) {
                        return;
                    }

                    MidiSink sink = echo2sink.get(Byte.toUnsignedInt(s.echo));

                    if (sink == null) {
                        throw new SysexExchangeError("Sink NOT Found " + s);
                    }

                    currentSource = source;
                    currentSink = sink;
                    globalChannel = Byte.toUnsignedInt(s.channel);
                    future.complete(true);
                } catch (Exception e) {
                    future.completeExceptionally(e);
                } finally {
                    if (currentSource != source) {
                        source.unsubscribe();
                    }
                }
            }));
        }


        @Override
        public Mono<Boolean> request() {
            midi.getSinks().forEach(sink -> {
                int echo = (int)(127 * Math.random());
                echo2sink.put(echo, sink);

                byte[] ba = Utils.byteArray(header)
                        .append(echo)
                        .append(Constants.END_OF_EXCLUSIVE)
                        .build();

                MidiMessage msg = Utils.message(ba);
                sink.send(msg);
            });

            return Mono.fromFuture(future)
                    .timeout(Duration.ofSeconds(4), Mono.just(false));
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

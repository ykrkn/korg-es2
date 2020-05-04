package ykrkn.es2.midi;

import javax.sound.midi.InvalidMidiDataException;
import javax.sound.midi.MidiMessage;
import javax.sound.midi.ShortMessage;
import javax.sound.midi.SysexMessage;
import java.util.Arrays;

public final class Utils {

    // https://blogs.bl0rg.net/netzstaub/2008/08/14/encoding-8-bit-data-in-midi-sysex/
    public static byte[] sysex2data(byte[] ba) {
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

    public static String trace(MidiMessage message) {
        return trace(message.getMessage());
    }

    public static String trace(byte[] a) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < a.length; i++) {
            if (i == 32) {
                sb.append("...");
            } else if (i > 32 && i < a.length - 8) {
                continue;
            } else {
                sb.append(String.format("%02x", a[i])).append(' ');
            }
        }
        return sb.toString();
    }

    public static MidiMessage message(byte[] data) {
        if (data.length == 0) {
            throw new SysexExchangeError("Empty data");
        }

        try {
            int statusByteInt = Byte.toUnsignedInt(data[0]);
            if (statusByteInt == Constants.SYSTEM_EXCLUSIVE)
                return new SysexMessage(data, data.length);
            else {
                return new ShortMessage(data[0], data[1], data[2]);
            }
        } catch (InvalidMidiDataException e) {
            throw new SysexExchangeError(e);
        }
    }

    public static ByteArrayBuilder byteArray() {
        return new ByteArrayBuilder();
    }

    public static ByteArrayBuilder byteArray(byte[] v) {
        return new ByteArrayBuilder(v);
    }

    public static class ByteArrayBuilder {
        byte[] a;

        private ByteArrayBuilder() {
            this(new byte[0]);
        }

        private ByteArrayBuilder(byte[] v) {
            this.a = Arrays.copyOf(v, v.length);
        }

        public ByteArrayBuilder append(byte v) {
            byte[] _a = Arrays.copyOf(a, a.length+1);
            _a[_a.length-1] = v;
            a = _a;
            return this;
        }

        public ByteArrayBuilder append(int v) {
            return append((byte) (0xFF & v));
        }

        public ByteArrayBuilder append(byte[] v) {
            byte[] _a = Arrays.copyOf(a, a.length+v.length);
            for (int i = 0; i < v.length; i++) {
                _a[a.length+i] = v[i];
            }
            a = _a;
            return this;
        }

        public byte[] build() {
            return a;
        }
    }
}

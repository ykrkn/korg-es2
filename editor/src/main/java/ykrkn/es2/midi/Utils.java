package ykrkn.es2.midi;

import javax.sound.midi.MidiMessage;
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
}

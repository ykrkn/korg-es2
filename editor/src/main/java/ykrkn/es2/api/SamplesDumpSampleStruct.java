package ykrkn.es2.api;

import struct.ArrayLengthMarker;
import struct.CString;
import struct.StructClass;
import struct.StructField;
import ykrkn.es2.Category;

import java.io.Serializable;

// https://audiocoding.ru/articles/2008-05-22-wav-file-structure/
// https://gist.github.com/jack126guy/b2d38db0c96ca247ae1ad385e011fd78

@StructClass
public class SamplesDumpSampleStruct implements Serializable {

    private static final long serialVersionUID = 1L;

    @StructField(order = 0)
    public byte[] pad1 = new byte[20];

    // 20…21 (2 байта)	audioFormat	Аудио формат, список допустипых форматов.
    // Для PCM = 1 (то есть, Линейное квантование).
    // Значения, отличающиеся от 1, обозначают некоторый формат сжатия.
    @StructField(order = 1)
    public short audioFormat;

    // 22…23 (2 байта)	numChannels	Количество каналов. Моно = 1, Стерео = 2 и т.д.
    @StructField(order = 2)
    public short numChannels;

    // 24…27 (4 байта)	sampleRate	Частота дискретизации. 8000 Гц, 44100 Гц и т.д.
    @StructField(order = 3)
    public int sampleRate;

    // 28…31 (4 байта)	byteRate Количество байт, переданных за секунду воспроизведения.
    @StructField(order = 4)
    public int byteRate;

    // 32…33 (2 байта)	blockAlign	Количество байт для одного сэмпла, включая все каналы.
    @StructField(order = 5)
    public short blockAlign;

    // 34…35 (2 байта)	bitsPerSample Количество бит в сэмпле.
    // Так называемая «глубина» или точность звучания. 8 бит, 16 бит и т.д.
    @StructField(order = 6)
    public short bitsPerSample;

    @StructField(order = 7)
    public byte[] pad2 = new byte[4];

    // numSamples * numChannels * bitsPerSample/8
    @StructField(order = 8)
    @ArrayLengthMarker(fieldName = "waveData")
    public int dataSize;

    @StructField(order = 9)
    public byte[] waveData;




    
    // korg..esli subchunk Header with size = 1172
    @StructField(order = 10)
    public byte[] pad3 = new byte[16];

    // Offset 0 (0x0000): Sample number, except zero-based so it would be one less than the number displayed, as a 16-bit integer.
    @StructField(order = 11)
    public short number;

    // Offset 2 (0x0002): Sample name in ASCII, padded by nulls to 16 bytes.
    @StructField(order = 12)
    public CString name = new CString(16);

    // Offset 18 (0x0012): Category number as a 16-bit integer. Starting at 0, the categories are:
    // Analog, Audio In, Kick, Snare, Clap, HiHat, Cymbal, Hits, Shots, Voice, SE, FX, Tom, Perc., Phrase, Loop, PCM, User.
    @StructField(order = 13)
    public short category;

    // Offset 20 (0x0014): "Absolute sample number" (e2sEdit) or "import number" (Oe1sSLE) as a 16-bit integer.
    // For the factory samples, it seems to start at 50 and increment for each channel
    // (i.e., one for mono samples and two for stereo samples). Not entirely sure what this is used for.
    @StructField(order = 14)
    public short absNumber;

    // Offset 22 (0x0016): Fixed string: 0x00 0x00 0x00 0x7F 0x00 0x01 0x00 0x00 0x00 0x00 0x00 0x00
    // Offset 34 (0x0022): "Playback period," according to Oe2sSLE, as a 16-bit integer, which by default is calculated as 63132 - log2(sample rate) * 3072 rounded to the nearest integer.
    @StructField(order = 15)
    public byte[] pad4 = new byte[14];

    // Offset 36 (0x0024): Playback volume as a 16-bit integer.
    @StructField(order = 16)
    public short volume; // FIXME: looks invalid

    // Offset 38 (0x0026): Two nulls (although Oe2sSLE seems to acknowledge that the first byte may vary).
    @StructField(order = 17)
    public byte[] pad6 = new byte[2];

    // Offset 40 (0x0028): Start point as a 32-bit integer offset into the audio data.
    @StructField(order = 18)
    public int startPoint;

    // Offset 44 (0x002C): Loop point as a 32-bit integer offset into the audio data.
    @StructField(order = 19)
    public int loopPoint;

    // Offset 48 (0x0030): End point as a 32-bit integer offset into the audio data. For both the loop and end point,
    // it seems that the "end" of the sample is two less than the data length.
    @StructField(order = 20)
    public int endPoint;

    // Offset 52 (0x0034): Loop flag as a 8-bit integer: 0 = loop, 1 = one-shot.
    @StructField(order = 21)
    public byte loop;
    
    // Offset 54 (0x0035): Seven nulls.
    // Offset 60 (0x003C): Data length of the WAVE file.
    // Offset 64 (0x0040): The byte 0x01.
    // Offset 65 (0x0041): Stereo flag as an 8-bit integer: 0 = mono, 1 = stereo.
    // Offset 66 (0x0042): Loudness ("play level") flag as an 8-bit integer: 0 = normal, 1 = +12dB.
    // Offset 67 (0x0043): Fixed string: 0x01 0xB0 0x04 0x00 0x00.
    // Offset 72 (0x0048): Sample rate as a 32-bit integer.
    // Offset 76 (0x004C): A null.
    // Offset 77 (0x004C): Sample tune as an 8-bit signed two's-complement integer.
    // Offset 78 (0x004E): Zero-based sample number again.
    
}

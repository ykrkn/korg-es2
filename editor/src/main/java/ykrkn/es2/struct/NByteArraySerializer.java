package ykrkn.es2.struct;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class NByteArraySerializer extends StdSerializer<byte[]> {

    public NByteArraySerializer() {
        this(null);
    }

    public NByteArraySerializer(Class<byte[]> t) {
        super(t);
    }

    @Override
    public void serialize(byte[] value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        gen.writeStartArray();
        for (int i = 0; i < value.length; i++) {
            gen.writeNumber(Byte.toUnsignedInt(value[i]));
        }
        gen.writeEndArray();
    }
}

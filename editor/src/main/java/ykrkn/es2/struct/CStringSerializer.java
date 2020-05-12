package ykrkn.es2.struct;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import struct.CString;

import java.io.IOException;

public class CStringSerializer extends StdSerializer<CString> {
    public CStringSerializer() {
        this(null);
    }
    public CStringSerializer(Class<CString> t) {
        super(t);
    }

    @Override
    public void serialize(CString value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        gen.writeString(value.toString());
    }
}

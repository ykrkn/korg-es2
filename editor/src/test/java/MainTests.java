import org.junit.Assert;
import org.junit.Test;
import ykrkn.es2.ES2AllSamplesDumpStruct;

import java.nio.file.Files;
import java.nio.file.Paths;

public class MainTests {

    @Test
    public void allSamplesDumpTest() throws Exception {
        byte[] src = Files.readAllBytes(Paths.get("/Users/sx/Desktop/e2sSample.all"));
        ES2AllSamplesDumpStruct samplesDumpStruct = ES2AllSamplesDumpStruct.unpack(src);
        samplesDumpStruct.trace();
        byte[] sink = samplesDumpStruct.pack();
        Assert.assertArrayEquals(src, sink);
    }

}

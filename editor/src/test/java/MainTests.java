import org.junit.Assert;
import org.junit.Test;
import ykrkn.es2.api.SampleService;
import ykrkn.es2.api.SamplesDumpStruct;

import java.nio.file.Files;
import java.nio.file.Paths;

public class MainTests {

    @Test
    public void allSamplesDumpTest() throws Exception {
        SampleService service = new SampleService();
        byte[] src = Files.readAllBytes(Paths.get("/Users/sx/Desktop/e2sSample.all"));
        service.unpack(src);
        service.trace();
        byte[] sink = service.pack();
        Assert.assertArrayEquals(src, sink);
    }

}

import org.junit.Assert;
import org.junit.Test;
import ykrkn.es2.Constants;
import ykrkn.es2.api.PatternService;
import ykrkn.es2.api.SampleService;
import ykrkn.es2.api.SampleVO;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

public class MainTests {

    @Test
    public void allPatternsDumpTest() throws Exception {
        PatternService service = new PatternService();
        byte[] src = Files.readAllBytes(Paths.get("/Users/sx/src/korg-es2/assets/data.bin"));
        service.unpack(src);
        service.trace();
        byte[] sink = service.pack();
        Assert.assertArrayEquals(src, sink);
    }

    @Test
    public void allSamplesDumpTest() throws Exception {
        SampleService service = new SampleService();
        byte[] src = Files.readAllBytes(Paths.get("/Users/sx/Desktop/e2sSample.all"));
        service.unpack(src);
        service.trace();

        int sec = service.getFreeMemorySeconds();
        Assert.assertTrue(sec > 0 && sec <= Constants.SAMPLE_MEMORY_SEC);
        
        byte[] sink = service.pack();
        Assert.assertArrayEquals(src, sink);
    }

    @Test
    public void playSampleTest() throws Exception {
        SampleService service = new SampleService();
        byte[] src = Files.readAllBytes(Paths.get("/Users/sx/Desktop/e2sSample.all"));
        service.unpack(src);
        List<SampleVO> list = service.getAllSamples();
        int index = (int) ((list.size() - 1) * Math.random());
        System.out.println("Play " + index);
        service.playSound(list.get(index));
    }

}

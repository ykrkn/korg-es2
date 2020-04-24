import org.junit.Assert;
import org.junit.Test;
import ykrkn.es2.api.SampleService;
import ykrkn.es2.api.SampleVO;

import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.Clip;
import java.io.InputStream;
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

    @Test
    public void playSampleTest() throws Exception {
        SampleService service = new SampleService();
        byte[] src = Files.readAllBytes(Paths.get("/Users/sx/Desktop/e2sSample.all"));
        service.unpack(src);
        SampleVO sample = service.getAllSamples().get(0);

        try (Clip clip = AudioSystem.getClip();
             InputStream is = sample.getAudioStream();
             AudioInputStream stream = AudioSystem.getAudioInputStream(is)) {
            clip.open(stream);
            clip.start();
            clip.drain();
            Thread.sleep(2000);
        }
    }

}

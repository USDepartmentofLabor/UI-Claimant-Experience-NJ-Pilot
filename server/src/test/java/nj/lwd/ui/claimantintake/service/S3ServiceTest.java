package nj.lwd.ui.claimantintake.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.MockitoAnnotations.openMocks;

import java.net.URL;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.core.env.Environment;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3ClientBuilder;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@ExtendWith(OutputCaptureExtension.class)
class S3ServiceTest {

    private final S3Client s3Client = mock(S3Client.class, RETURNS_DEEP_STUBS);

    private S3Service s3Service;

    @BeforeEach
    void beforeEach() {
        openMocks(this);
        var environment = mock(Environment.class);
        when(environment.getActiveProfiles()).thenReturn(new String[0]);

        // Scope of static mocking S3Client confined to this setup block
        try (var mockedStatic = mockStatic(S3Client.class)) {
            var s3ClientBuilder = mock(S3ClientBuilder.class);
            mockedStatic.when(S3Client::builder).thenReturn(s3ClientBuilder);
            when(s3ClientBuilder.credentialsProvider(any(AwsCredentialsProvider.class)))
                    .thenReturn(s3ClientBuilder);
            when(s3ClientBuilder.build()).thenReturn(s3Client);

            s3Service = new S3Service(environment);
        }
    }

    @Test
    void uploadMakesAPutTheObjectRequest() throws Exception {
        when(s3Client.utilities().getUrl(any(GetUrlRequest.class)))
                .thenReturn(new URL("http://url-to-uploaded-object"));

        // when: upload is called
        s3Service.upload("some-bucket", "my-key", Map.of("some-key", "some-value"), "some-kms-key");

        // then: the s3 client makes a put object requests
        verify(s3Client, times(1)).putObject(any(PutObjectRequest.class), any(RequestBody.class));
    }
}

package nj.lwd.ui.claimantintake.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.InputStream;
import java.net.URI;
import java.net.URL;
import java.nio.ByteBuffer;
import java.util.Arrays;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3ClientBuilder;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.ServerSideEncryption;

@Service
public class S3Service {

    private final Logger logger = LoggerFactory.getLogger(S3Service.class);

    private final S3Client s3Client;

    @Autowired
    protected S3Service(Environment environment) {
        S3ClientBuilder builder = S3Client.builder();

        if (Arrays.stream(environment.getActiveProfiles())
                .anyMatch(profile -> profile.equalsIgnoreCase("local"))) {
            String accessKeyId = environment.getProperty("aws.accessKeyId");
            String secretKey = environment.getProperty("aws.secretKey");
            AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKeyId, secretKey);
            builder.credentialsProvider(StaticCredentialsProvider.create(awsCredentials));
        } else {
            builder.credentialsProvider(DefaultCredentialsProvider.create());
        }

        String awsRegion = environment.getProperty("aws.region");
        if (awsRegion != null) {
            builder.region(Region.of(awsRegion));
        }

        String endpointUrl = environment.getProperty("aws.s3.endpoint-url");
        if (endpointUrl != null) {
            builder.endpointOverride(URI.create(endpointUrl));
        }

        this.s3Client = builder.build();
    }

    public void upload(String bucket, String key, Object object, String kmsKey)
            throws AwsServiceException, SdkClientException, JsonProcessingException {
        var request =
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .bucketKeyEnabled(true)
                        .serverSideEncryption(ServerSideEncryption.AWS_KMS)
                        .ssekmsKeyId(kmsKey)
                        .build();
        var requestBody = buildRequestBody(object);

        var response = s3Client.putObject(request, requestBody);
        final URL reportUrl =
                s3Client.utilities()
                        .getUrl(GetUrlRequest.builder().bucket(bucket).key(key).build());

        logger.debug("S3 putObjectResponse: {}", response);
        logger.debug("S3 reportUrl: {}", reportUrl);
    }

    public InputStream get(String bucket, String key) {
        logger.debug("S3 Get bucket: {}", bucket);
        logger.debug("s3 Get key: {}", key);

        GetObjectRequest req = GetObjectRequest.builder().bucket(bucket).key(key).build();

        return s3Client.getObject(req);
    }

    private RequestBody buildRequestBody(Object object) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        byte[] content = mapper.writeValueAsBytes(object);
        return RequestBody.fromByteBuffer(ByteBuffer.wrap(content));
    }
}

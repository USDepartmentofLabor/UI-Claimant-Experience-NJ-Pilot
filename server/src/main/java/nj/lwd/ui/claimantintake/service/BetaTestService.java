package nj.lwd.ui.claimantintake.service;

import java.util.Optional;
import nj.lwd.ui.claimantintake.constants.ClaimEventCategory;
import nj.lwd.ui.claimantintake.model.Claim;
import nj.lwd.ui.claimantintake.model.ClaimEvent;
import nj.lwd.ui.claimantintake.model.Claimant;
import nj.lwd.ui.claimantintake.repository.ClaimRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.core.exception.SdkClientException;

@Service
public class BetaTestService {

    private final Logger logger = LoggerFactory.getLogger(BetaTestService.class);

    private final String claimsBucket;
    private final String claimsBucketKmsKey;
    private final S3Service s3Service;
    private final ClaimantStorageService claimantStorageService;
    private final ClaimRepository claimRepository;

    @Autowired
    protected BetaTestService(
            @Value("${aws.s3.claims-bucket}") String claimsBucket,
            @Value("${aws.s3.claims-bucket-kms-key}") String claimsBucketKmsKey,
            S3Service s3Service,
            ClaimantStorageService claimantStorageService,
            ClaimRepository claimRepository) {
        this.claimsBucket = claimsBucket;
        this.claimsBucketKmsKey = claimsBucketKmsKey;
        this.s3Service = s3Service;
        this.claimantStorageService = claimantStorageService;
        this.claimRepository = claimRepository;
    }

    public BetaArtifactStorageResult storeClaimArtifact(String claimantIdpId, String htmlArtifact) {
        logger.info(
                "Attempting to store beta test claim artifact associated with user {}",
                claimantIdpId);

        Optional<Claimant> existingClaimant = claimantStorageService.getClaimant(claimantIdpId);
        if (existingClaimant.isEmpty()) {
            logger.error(
                    "Received request to store a beta test claim artifact for user {} without a"
                            + " corresponding claimant entry",
                    claimantIdpId);
            return new BetaArtifactStorageResult(
                    false, HttpStatus.BAD_REQUEST, "User must be initialized as a claimant");
        }

        Claimant claimant = existingClaimant.get();
        Optional<Claim> existingCompletedClaim = claimant.getActiveCompletedClaim();
        if (existingCompletedClaim.isEmpty()) {
            logger.error(
                    "Received request to store a beta test claim artifact for claimant {}, but"
                            + " claimant does not have a completed claim.",
                    claimant.getId());
            return new BetaArtifactStorageResult(
                    false,
                    HttpStatus.BAD_REQUEST,
                    "Claim must be successfully completed before it can be submitted");
        }

        Claim claim = existingCompletedClaim.get();
        logger.info("Initiating beta test claim artifact storage for claim {}", claim.getId());
        claim.addEvent(new ClaimEvent(ClaimEventCategory.INITIATED_BETA_TEST_SUBMIT));
        try {
            var s3Key = getS3Location(claim);
            s3Service.upload(claimsBucket, s3Key, htmlArtifact, claimsBucketKmsKey);
            claim.addEvent(new ClaimEvent(ClaimEventCategory.BETA_TEST_SUBMITTED));
            claimRepository.save(claim);
            return new BetaArtifactStorageResult(true, HttpStatus.OK);
        } catch (AwsServiceException e) {
            logger.error(
                    "Amazon S3 unable to process request to save beta test claim artifact for claim"
                            + " {} to S3: {}",
                    claim.getId(),
                    e.getMessage());
            claim.addEvent(new ClaimEvent(ClaimEventCategory.BETA_TEST_SUBMIT_FAILED));
            claimRepository.save(claim);
            return new BetaArtifactStorageResult(
                    false,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Artifact storage service is unable to process request");
        } catch (SdkClientException e) {
            logger.error(
                    "Unable to contact Amazon S3 or unable to parse the response while trying to"
                            + " save beta test claim artifact for claim {} to S3: {}",
                    claim.getId(),
                    e.getMessage());
            claim.addEvent(new ClaimEvent(ClaimEventCategory.BETA_TEST_SUBMIT_FAILED));
            claimRepository.save(claim);
            return new BetaArtifactStorageResult(
                    false,
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Artifact storage service is currently unavailable. Please try again later");
        }
    }

    public static class BetaArtifactStorageResult {
        private final boolean success;
        private final HttpStatus status;
        private final String message;

        public BetaArtifactStorageResult(boolean success, HttpStatus status, String message) {
            this.success = success;
            this.status = status;
            this.message = message;
        }

        public BetaArtifactStorageResult(boolean success, HttpStatus status) {
            this(success, status, null);
        }

        public boolean isSuccess() {
            return success;
        }

        public HttpStatus getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }
    }

    private String getS3Location(Claim claim) {
        return "claims_inbox/%s/claim.html".formatted(claim.getId());
    }
}

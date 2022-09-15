package nj.lwd.ui.claimantintake.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.util.Map;
import java.util.Optional;
import nj.lwd.ui.claimantintake.constants.ClaimEventCategory;
import nj.lwd.ui.claimantintake.model.Claim;
import nj.lwd.ui.claimantintake.model.ClaimEvent;
import nj.lwd.ui.claimantintake.model.Claimant;
import nj.lwd.ui.claimantintake.repository.ClaimRepository;
import nj.lwd.ui.claimantintake.repository.ClaimantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.core.exception.SdkClientException;

@Service
public class ClaimStorageService {

    private final Logger logger = LoggerFactory.getLogger(ClaimStorageService.class);

    private final String claimsBucket;

    private final S3Service s3Service;
    private final ClaimRepository claimRepository;
    private final ClaimantRepository claimantRepository;

    @Autowired
    ClaimStorageService(
            @Value("${aws.s3.claims-bucket}") String claimsBucket,
            S3Service s3Service,
            ClaimRepository claimRepository,
            ClaimantRepository claimantRepository) {
        this.claimsBucket = claimsBucket;
        this.s3Service = s3Service;
        this.claimRepository = claimRepository;
        this.claimantRepository = claimantRepository;
    }

    // TODO: Use claimantId instead of claimantIdpId
    public boolean saveClaim(String claimantIdpId, Map<String, Object> claimPayload) {
        // TODO: Persist a claimant on login instead of here (when that functionality exists)
        logger.debug("Attempting to find claimant by IDP Id: {}", claimantIdpId);
        Optional<Claimant> existingClaimant = claimantRepository.findClaimantByIdpId(claimantIdpId);
        Claimant claimant =
                existingClaimant.orElseGet(
                        () -> {
                            logger.info(
                                    "No existing claimant found by IDP id. Adding a new"
                                            + " claimant...");

                            return claimantRepository.save(new Claimant(claimantIdpId));
                        });

        // Get or create the corresponding claim
        Optional<Claim> existingClaim = claimant.getActivePartialClaim();
        Claim claim =
                existingClaim.orElseGet(
                        () -> {
                            logger.info(
                                    "No active partial claim found for claimant {}. Creating a new"
                                            + " partial claim...",
                                    claimant.getId());
                            var newClaim = new Claim();
                            claimant.addClaim(newClaim);
                            return claimRepository.save(newClaim);
                        });

        logger.info(
                "Initiating partial claim save for claim {} and claimant {}",
                claim.getId(),
                claimant.getId());
        claim.addEvent(new ClaimEvent(ClaimEventCategory.INITIATED_SAVE));

        try {
            String s3Key = "%s/%s.json".formatted(claimant.getId(), claim.getId());
            s3Service.upload(claimsBucket, s3Key, claimPayload);

            claim.addEvent(new ClaimEvent(ClaimEventCategory.SAVED));

            logger.info(
                    "Successfully saved partial claim {} for claimant {} at {} in S3",
                    claim.getId(),
                    claimant.getId(),
                    s3Key);
            claimantRepository.save(claimant);
            return true;
        } catch (JsonProcessingException e) {
            logger.error(
                    "Claim {} payload is unable to be converted to JSON for storage in S3: {}",
                    claim.getId(),
                    e.getMessage());
            claim.addEvent(new ClaimEvent(ClaimEventCategory.SAVE_FAILED));
            claimantRepository.save(claimant);
            return false;
        } catch (AwsServiceException e) {
            logger.error(
                    "Amazon S3 unable to process request to save claim {} to S3: {}",
                    claim.getId(),
                    e.getMessage());
            claim.addEvent(new ClaimEvent(ClaimEventCategory.SAVE_FAILED));
            claimantRepository.save(claimant);
            return false;
        } catch (SdkClientException e) {
            logger.error(
                    "Unable to contact Amazon S3 or unable to parse the response while trying to"
                            + " save claim {} to S3: {}",
                    claim.getId(),
                    e.getMessage());
            claim.addEvent(new ClaimEvent(ClaimEventCategory.SAVE_FAILED));
            claimantRepository.save(claimant);
            return false;
        }
    }
}

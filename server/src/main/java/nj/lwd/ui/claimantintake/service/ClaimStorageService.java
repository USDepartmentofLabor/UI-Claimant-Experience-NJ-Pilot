package nj.lwd.ui.claimantintake.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import nj.lwd.ui.claimantintake.constants.ClaimEventCategory;
import nj.lwd.ui.claimantintake.dto.RecentEmployersResponse;
import nj.lwd.ui.claimantintake.exception.ClaimDataRetrievalException;
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
    private final String claimsBucketKmsKey;

    private final S3Service s3Service;
    private final ClaimRepository claimRepository;
    private final ClaimantRepository claimantRepository;
    private final ClaimantStorageService claimantStorageService;

    @Autowired
    ClaimStorageService(
            @Value("${aws.s3.claims-bucket}") String claimsBucket,
            @Value("${aws.s3.claims-bucket-kms-key}") String claimsBucketKmsKey,
            S3Service s3Service,
            ClaimRepository claimRepository,
            ClaimantRepository claimantRepository,
            ClaimantStorageService claimantStorageService) {
        this.claimsBucket = claimsBucket;
        this.claimsBucketKmsKey = claimsBucketKmsKey;
        this.s3Service = s3Service;
        this.claimRepository = claimRepository;
        this.claimantRepository = claimantRepository;
        this.claimantStorageService = claimantStorageService;
    }

    public boolean completeClaim(String claimantIdpId, Map<String, Object> claimPayload) {
        logger.info("Attempting to complete claim for claimant with IDP ID: {}", claimantIdpId);

        Claimant claimant = claimantStorageService.getOrCreateClaimant(claimantIdpId);
        Claim claim = getOrCreatePartialClaim(claimant);

        claim.addEvent(new ClaimEvent(ClaimEventCategory.INITIATED_COMPLETE));

        claim.addEvent(new ClaimEvent(ClaimEventCategory.INITIATED_SAVE));

        String s3Key = getS3Location(claimant, claim);
        try {
            s3Service.upload(claimsBucket, s3Key, claimPayload, this.claimsBucketKmsKey);
            claim.addEvent(new ClaimEvent(ClaimEventCategory.SAVED));
            logger.info(
                    "Successfully saved completed claim {} for claimant {} at {} in S3",
                    claim.getId(),
                    claimant.getId(),
                    s3Key);
            claim.addEvent(new ClaimEvent(ClaimEventCategory.COMPLETED));
            claimantRepository.save(claimant);
            return true;
        } catch (JsonProcessingException e) {
            logger.error(
                    "Claim {} payload is unable to be converted to JSON for storage in S3: {}",
                    claim.getId(),
                    e.getMessage());
            claim.addEvent(new ClaimEvent(ClaimEventCategory.SAVE_FAILED));
            claim.addEvent(new ClaimEvent(ClaimEventCategory.COMPLETE_FAILED));
            claimantRepository.save(claimant);
            return false;
        } catch (AwsServiceException e) {
            logger.error(
                    "Amazon S3 unable to process request to save claim {} to S3: {}",
                    claim.getId(),
                    e.getMessage());
            claim.addEvent(new ClaimEvent(ClaimEventCategory.SAVE_FAILED));
            claim.addEvent(new ClaimEvent(ClaimEventCategory.COMPLETE_FAILED));
            claimantRepository.save(claimant);
            return false;
        } catch (SdkClientException e) {
            logger.error(
                    "Unable to contact Amazon S3 or unable to parse the response while trying to"
                            + " save claim {} to S3: {}",
                    claim.getId(),
                    e.getMessage());
            claim.addEvent(new ClaimEvent(ClaimEventCategory.SAVE_FAILED));
            claim.addEvent(new ClaimEvent(ClaimEventCategory.COMPLETE_FAILED));
            claimantRepository.save(claimant);
            return false;
        }
    }

    public boolean saveClaim(String claimantIdpId, Map<String, Object> claimPayload) {
        logger.info("Saving claim data associated with user {}", claimantIdpId);
        Claimant claimant = claimantStorageService.getOrCreateClaimant(claimantIdpId);
        Claim claim = getOrCreatePartialClaim(claimant);

        logger.info(
                "Initiating partial claim save for claim {} and claimant {}",
                claim.getId(),
                claimant.getId());
        claim.addEvent(new ClaimEvent(ClaimEventCategory.INITIATED_SAVE));

        try {
            String s3Key = getS3Location(claimant, claim);
            s3Service.upload(claimsBucket, s3Key, claimPayload, this.claimsBucketKmsKey);

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

    public boolean saveRecentEmployer(
            String claimantIdpId, RecentEmployersResponse recentEmployers) {
        Claimant claimant = claimantStorageService.getOrCreateClaimant(claimantIdpId);
        Optional<Claim> existingClaim = claimant.getActivePartialClaim();

        logger.info("Attempting to save recent employer data for claimant {}", claimant.getId());
        if (existingClaim.isPresent()) {

            Claim claim = existingClaim.get();
            try {
                String s3Key = getS3EmployersLocation(claimant, claim);
                s3Service.upload(claimsBucket, s3Key, recentEmployers, this.claimsBucketKmsKey);

                logger.info(
                        "Successfully saved recent employer data for {} for claimant {} at {} in"
                                + " S3",
                        claim.getId(),
                        claimant.getId(),
                        s3Key);
                return true;
            } catch (JsonProcessingException e) {
                logger.error(
                        "Recent employer data for claim {} payload is unable to be converted to"
                                + " JSON for storage in S3: {}",
                        claim.getId(),
                        e.getMessage());
            } catch (AwsServiceException e) {
                logger.error(
                        "Amazon S3 unable to process request to save recent employer data for claim"
                                + " {} to S3: {}",
                        claim.getId(),
                        e.getMessage());

                return false;
            } catch (SdkClientException e) {
                logger.error(
                        "Unable to contact Amazon S3 or unable to parse the response while trying"
                                + " to save recent employer data for claim {} to S3: {}",
                        claim.getId(),
                        e.getMessage());
                return false;
            }
        }
        return false;
    }

    public Optional<Map<String, Object>> getPartialClaim(String claimantIdpId)
            throws ClaimDataRetrievalException {
        logger.info("Checking for partial claim data associated with user {}", claimantIdpId);
        Claimant claimant = claimantStorageService.getOrCreateClaimant(claimantIdpId);
        Optional<Claim> existingClaim = claimant.getActivePartialClaim();

        if (existingClaim.isPresent()) {
            Claim claim = existingClaim.get();
            logger.info(
                    "Getting partial claim data for claimant {} and claim {}",
                    claimant.getId(),
                    claim.getId());
            try {
                String s3Key = getS3Location(claimant, claim);
                InputStream stream = s3Service.get(claimsBucket, s3Key);
                var claimData = deserializeToClaimData(stream);
                logger.info(
                        "Successfully retrieved partial claim data for claim {} and claimant {}"
                                + " from {} in S3",
                        claim.getId(),
                        claimant.getId(),
                        s3Key);
                return Optional.of(claimData);
            } catch (AwsServiceException e) {
                var errorMessage =
                        String.format(
                                "Amazon S3 unable to process request to get claim data for claim"
                                        + " %s",
                                claim.getId());
                throw new ClaimDataRetrievalException(errorMessage, e);
            } catch (SdkClientException e) {
                var errorMessage =
                        String.format(
                                "Unable to contact Amazon S3 or unable to parse the response while"
                                        + " trying to get claim %s from S3",
                                claim.getId());
                throw new ClaimDataRetrievalException(errorMessage, e);
            } catch (IOException e) {
                var errorMessage =
                        String.format(
                                "Unable to process S3 object data for claim %s", claim.getId());
                throw new ClaimDataRetrievalException(errorMessage, e);
            }
        } else {
            logger.info(
                    "Claimant {} does not yet have an active claim to retrieve", claimant.getId());
            return Optional.empty();
        }
    }

    private Claim getOrCreatePartialClaim(Claimant claimant) {
        logger.info("Checking for active partial claim for claimant {}", claimant.getId());
        Optional<Claim> existingClaim = claimant.getActivePartialClaim();
        return existingClaim.orElseGet(
                () -> {
                    logger.info(
                            "No active partial claim found for claimant {}. Creating a new"
                                    + " partial claim...",
                            claimant.getId());
                    var newClaim = new Claim();
                    claimant.addClaim(newClaim);
                    var savedClaim = claimRepository.save(newClaim);
                    logger.info(
                            "New claim created with id {} for claimant {}",
                            savedClaim.getId(),
                            claimant.getId());
                    return savedClaim;
                });
    }

    public String getSSN(String claimantIdpId) {
        logger.info("Attempting to retrieve ssn for claim {}", claimantIdpId);

        Optional<Claimant> claimant = claimantStorageService.getClaimant(claimantIdpId);
        // check claimant exists so new one is not created by get partial claim call
        if (claimant.isPresent()) {
            try {
                Optional<Map<String, Object>> claim = getPartialClaim(claimantIdpId);

                if (claim.isPresent() && claim.get().containsKey("ssn")) {
                    return claim.get().get("ssn").toString();
                }
            } catch (ClaimDataRetrievalException e) {
                logger.error(
                        "Unable to retrieve claim, thus unable to get ssn for claimant with IDP Id"
                                + " {}",
                        claimantIdpId);
            }
        }
        return null;
    }

    private Map<String, Object> deserializeToClaimData(InputStream stream) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        TypeReference<HashMap<String, Object>> typeRef = new TypeReference<>() {};
        return mapper.readValue(stream, typeRef);
    }

    private String getS3Location(Claimant claimant, Claim claim) {
        return "%s/%s.json".formatted(claimant.getId(), claim.getId());
    }

    private String getS3EmployersLocation(Claimant claimant, Claim claim) {
        return "%s/%s/wgpm.json".formatted(claimant.getId(), claim.getId());
    }
}

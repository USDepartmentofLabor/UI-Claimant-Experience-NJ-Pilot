package nj.lwd.ui.claimantintake.service;

import java.util.Map;
import java.util.Optional;
import nj.lwd.ui.claimantintake.constants.ClaimEventCategory;
import nj.lwd.ui.claimantintake.model.Claim;
import nj.lwd.ui.claimantintake.model.ClaimEvent;
import nj.lwd.ui.claimantintake.model.Claimant;
import nj.lwd.ui.claimantintake.repository.ClaimantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SubmissionService {
    private final ClaimantRepository claimantRepository;
    private final Logger logger = LoggerFactory.getLogger(SubmissionService.class);

    @Autowired
    public SubmissionService(ClaimantRepository claimantRepository) {
        // TODO -Nava api connection info here

        this.claimantRepository = claimantRepository;
    }

    private boolean saveInitiatedSubmission(String claimantIdpId) {

        logger.debug(
                "Attempting to save submission initiated event for claimant {}", claimantIdpId);
        Optional<Claimant> existingClaimant = claimantRepository.findClaimantByIdpId(claimantIdpId);
        if (existingClaimant.isEmpty()) {
            logger.debug("No claimant exists with idp id: {}", claimantIdpId);
            return false;
        }
        logger.debug("No after first check");

        // Get the corresponding claimant
        Claimant claimant = existingClaimant.get();

        Optional<Claim> existingClaim = claimant.getActiveCompletedClaim();
        // Do not allow submit event on non existing claims
        if (existingClaim.isEmpty()) {
            logger.debug(
                    "No existing claim for idp id: {}. Cannot submit externally.", claimantIdpId);
            return false;
        }

        // get the corresponding claim
        Claim claim = existingClaim.get();
        logger.info(
                "Initiating submission for claim {} and claimant {}",
                claim.getId(),
                claimant.getId());

        claim.addEvent(new ClaimEvent(ClaimEventCategory.INITIATED_SUBMIT));
        claimantRepository.save(claimant);
        return true;
    }

    private boolean saveFinishedSubmission(String claimantIdpId, boolean wasSubmissionSuccessful) {
        logger.debug("Attempting to save submission event for claimant {}", claimantIdpId);
        Optional<Claimant> existingClaimant = claimantRepository.findClaimantByIdpId(claimantIdpId);
        if (existingClaimant.isEmpty()) {
            logger.debug("No claimant exists with idp id: {}", claimantIdpId);
            return false;
        }

        // Get the corresponding claimant
        Claimant claimant = existingClaimant.get();

        Optional<Claim> existingClaim = claimant.getActiveCompletedClaim();
        // Do not allow submit event on non existing claims
        if (existingClaim.isEmpty()) {
            logger.debug(
                    "No existing claim for idp id: {}. Cannot submit externally.", claimantIdpId);
            return false;
        }

        // get the corresponding claim
        Claim claim = existingClaim.get();
        logger.debug(
                "Saving Submission event for claim {} and claimant {}",
                claim.getId(),
                claimant.getId());
        if (wasSubmissionSuccessful) {
            claim.addEvent(new ClaimEvent(ClaimEventCategory.SUBMITTED));
        } else {
            claim.addEvent(new ClaimEvent(ClaimEventCategory.SUBMIT_FAILED));
        }

        claimantRepository.save(claimant);
        return true;
    }

    public boolean sendClaim(Map<String, Object> validatedClaimPayload) {
        logger.debug("Sending Nava Api post");
        // used to force a claim post to fail
        if (validatedClaimPayload.containsKey("alternate_phone")
                && validatedClaimPayload.get("alternate_phone").equals("0000000000")) {
            logger.debug("Forcing sendClaim to return false");
            return false;
        }
        return true;
    }

    public boolean submitClaim(Map<String, Object> validatedClaimPayload, String claimantIdpId) {

        boolean submissionSuccess = false;
        boolean isSubmitEventSaved = false;
        boolean isInitiatedEventSaved = saveInitiatedSubmission(claimantIdpId);

        if (isInitiatedEventSaved) {
            submissionSuccess = sendClaim(validatedClaimPayload);
            isSubmitEventSaved = saveFinishedSubmission(claimantIdpId, submissionSuccess);
        }
        return submissionSuccess && isSubmitEventSaved;
    }
}

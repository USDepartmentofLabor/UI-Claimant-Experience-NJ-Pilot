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
public class ClaimStorageService {

    private final Logger logger = LoggerFactory.getLogger(ClaimStorageService.class);

    private final ClaimantRepository claimantRepository;

    @Autowired
    ClaimStorageService(ClaimantRepository claimantRepository) {
        this.claimantRepository = claimantRepository;
    }

    // TODO: Use claimantId instead of claimantIdpId
    public boolean saveClaim(String claimantIdpId, Map<String, Object> claimPayload) {
        // TODO: Persist a claimant on login instead of here (when that functionality exists)
        Optional<Claimant> existingClaimant = claimantRepository.findClaimantByIdpId(claimantIdpId);
        Claimant claimant = existingClaimant.orElse(new Claimant("test_id"));

        // Get or create the corresponding claim
        Optional<Claim> existingClaim = claimant.getActivePartialClaim();
        Claim claim =
                existingClaim.orElseGet(
                        () -> {
                            var newClaim = new Claim();
                            claimant.addClaim(newClaim);
                            return newClaim;
                        });

        logger.debug("Initiating partial claim save for claimant {}", claimant.getId());
        claim.addEvent(new ClaimEvent(ClaimEventCategory.INITIATED_SAVE));

        // try {
        // TODO: Save in S3.
        claim.addEvent(new ClaimEvent(ClaimEventCategory.SAVED));
        logger.debug("Successfully saved partial claim save for claimant {}", claimant.getId());
        claimantRepository.save(claimant);
        return true;
        // } catch(SomeAwsException e) {
        //   logger.error("Failed to save claim {} to S3: {}", claim.getId(), e.getMessage());
        //   claim.addEvent(new ClaimEvent(ClaimEventCategory.SAVE_FAILED));
        //   claimantRepository.save(claimant);
        //   return false;
        // }

    }
}

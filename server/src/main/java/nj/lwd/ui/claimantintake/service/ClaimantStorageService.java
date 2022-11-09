package nj.lwd.ui.claimantintake.service;

import java.util.Optional;
import nj.lwd.ui.claimantintake.model.Claimant;
import nj.lwd.ui.claimantintake.repository.ClaimantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClaimantStorageService {

    private final Logger logger = LoggerFactory.getLogger(ClaimantStorageService.class);

    private final ClaimantRepository claimantRepository;

    @Autowired
    public ClaimantStorageService(ClaimantRepository claimantRepository) {
        this.claimantRepository = claimantRepository;
    }

    /**
     * Gets (or creates and returns if one does not already exist) a Claimant corresponding to the
     * provided idpId
     *
     * @param idpId The unique Id of the claimant from the identity provider's user pool
     * @return the corresponding Claimant entity
     */
    public Claimant getOrCreateClaimant(String idpId) {
        logger.info("Attempting to find claimant by IDP Id {}", idpId);
        Optional<Claimant> existingClaimant = claimantRepository.findClaimantByIdpId(idpId);
        return existingClaimant.orElseGet(
                () -> {
                    logger.info(
                            "No existing claimant found by IDP id. Adding a new" + " claimant...");
                    var newClaimant = claimantRepository.save(new Claimant(idpId));
                    logger.info(
                            "New claimant created with id {} corresponding to idpId {}",
                            newClaimant.getId(),
                            newClaimant.getIdpId());
                    return newClaimant;
                });
    }
}

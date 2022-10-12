package nj.lwd.ui.claimantintake.service;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SubmissionService {
    private final Logger logger = LoggerFactory.getLogger(ClaimValidatorService.class);

    @Autowired
    public SubmissionService() {
        // TODO -Nava api connection info here
    }

    public boolean submitClaim(Map<String, Object> validatedClaimPayload) {
        logger.debug("Sending Nava Api post");
        return true;
    }
}

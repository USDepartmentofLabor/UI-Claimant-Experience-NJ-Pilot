package nj.lwd.ui.claimantintake.controller;

import java.util.Map;
import nj.lwd.ui.claimantintake.service.SubmissionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/submit")
public class SubmitClaimController {

    private final SubmissionService submissionService;
    private final Logger logger = LoggerFactory.getLogger(SubmitClaimController.class);

    @Autowired
    public SubmitClaimController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @PostMapping()
    public ResponseEntity<String> submitClaim(
            @RequestBody Map<String, Object> completedClaimPayload, Authentication authentication) {
        String claimantIdpId = authentication.getName();

        logger.debug("Initiating submit event for claimant: {}", claimantIdpId);
        boolean externalSubmissionSuccess =
                submissionService.submitClaim(completedClaimPayload, claimantIdpId);

        if (externalSubmissionSuccess) {
            return new ResponseEntity<>("Save successful", HttpStatus.OK);
        }
        return new ResponseEntity<>("Unable to submit claim.", HttpStatus.BAD_REQUEST);
    }
}

package nj.lwd.ui.claimantintake.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;
import nj.lwd.ui.claimantintake.service.ClaimStorageService;
import nj.lwd.ui.claimantintake.service.ClaimValidatorService;
import nj.lwd.ui.claimantintake.service.ExternalClaimFormatterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/complete-claim")
public class CompletedClaimController {

    private final ClaimStorageService claimStorageService;
    private final ClaimValidatorService claimValidatorService;
    private final ExternalClaimFormatterService externalClaimFormatterService;

    @Autowired
    CompletedClaimController(
            ClaimStorageService claimStorageService,
            ClaimValidatorService claimValidatorService,
            ExternalClaimFormatterService externalClaimFormatterService) {
        this.claimStorageService = claimStorageService;
        this.claimValidatorService = claimValidatorService;
        this.externalClaimFormatterService = externalClaimFormatterService;
    }

    @PostMapping()
    public ResponseEntity<Object> saveCompletedClaim(
            @RequestBody Map<String, Object> completedClaimPayload, Authentication authentication) {
        String claimantIdpId = authentication.getName();

        try {
            Map<String, Object> externalClaim =
                    externalClaimFormatterService.formatClaim(completedClaimPayload, claimantIdpId);
            ArrayList<String> errorList = claimValidatorService.validateClaim(externalClaim);

            if (errorList.size() > 0) {
                return new ResponseEntity<>(errorList, HttpStatus.BAD_REQUEST);
            }

        } catch (IOException e) {

            return new ResponseEntity<>(
                    "Save failed, error occurred accessing or reading the schema on the server"
                            + " side",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

        var saveStatus = claimStorageService.completeClaim(claimantIdpId, completedClaimPayload);

        if (saveStatus) {
            return new ResponseEntity<>("Save successful", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Save failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

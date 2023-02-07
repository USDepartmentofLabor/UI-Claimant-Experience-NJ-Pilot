package nj.lwd.ui.claimantintake.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.networknt.schema.ValidationMessage;
import java.io.IOException;
import java.util.Map;
import java.util.Set;
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
    public CompletedClaimController(
            ClaimStorageService claimStorageService,
            ClaimValidatorService claimValidatorService,
            ExternalClaimFormatterService externalClaimFormatterService) {
        this.claimStorageService = claimStorageService;
        this.claimValidatorService = claimValidatorService;
        this.externalClaimFormatterService = externalClaimFormatterService;
    }

    @PostMapping()
    public ResponseEntity<String> saveCompletedClaim(
            @RequestBody Map<String, Object> completedClaimPayload, Authentication authentication) {
        String claimantIdpId = authentication.getName();

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            Map<String, Object> externalClaim =
                    externalClaimFormatterService.formatClaim(completedClaimPayload, claimantIdpId);
            Set<ValidationMessage> errorSet =
                    claimValidatorService.validateAgainstSchema(
                            objectMapper.writeValueAsString(externalClaim));
            if (errorSet.size() > 0) {
                // TODO - change here when detailed error msgs are desired on the frontend
                return new ResponseEntity<>(
                        "Save failed, the schema was the correct JSON format but had invalid data.",
                        HttpStatus.BAD_REQUEST);
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

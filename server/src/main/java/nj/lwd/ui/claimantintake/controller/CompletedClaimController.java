package nj.lwd.ui.claimantintake.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.networknt.schema.ValidationMessage;
import java.io.IOException;
import java.util.Map;
import java.util.Set;
import nj.lwd.ui.claimantintake.service.ClaimStorageService;
import nj.lwd.ui.claimantintake.service.ClaimValidatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/complete-claim")
public class CompletedClaimController {

    private final ClaimStorageService claimStorageService;
    private final ClaimValidatorService claimValidatorService;

    @Autowired
    public CompletedClaimController(
            ClaimStorageService claimStorageService, ClaimValidatorService claimValidatorService) {
        this.claimStorageService = claimStorageService;
        this.claimValidatorService = claimValidatorService;
    }

    @PostMapping()
    public ResponseEntity<String> saveCompletedClaim(
            @RequestBody Map<String, Object> completedClaimPayload) {
        // TODO: Get claimant id from session and use that instead of the idp_id when auth is in
        //       place. For now, just make up a static IdpId and use that for all claims
        String claimantIdpId = "test_id";

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            Set<ValidationMessage> errorSet =
                    claimValidatorService.validateAgainstSchema(
                            objectMapper.writeValueAsString(completedClaimPayload));
            if (errorSet.size() > 0) {
                // TODO - change here when detailed error msgs are desired on the frontend
                return new ResponseEntity<>(
                        "Save failed, the schema was the correct JSON format but had invalid data.",
                        HttpStatus.BAD_REQUEST);
            }

        } catch (IOException e) {

            return new ResponseEntity<>(
                    "Save failed, error occured accessing or reading the schema on the server side",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

        var saveStatus = claimStorageService.completeClaim(claimantIdpId, completedClaimPayload);

        if (saveStatus) {

            return new ResponseEntity<>("Save successful", HttpStatus.OK);
        }

        return new ResponseEntity<>("Save failed", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

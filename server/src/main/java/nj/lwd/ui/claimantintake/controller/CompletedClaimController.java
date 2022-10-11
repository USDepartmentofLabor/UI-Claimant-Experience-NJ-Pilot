package nj.lwd.ui.claimantintake.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.networknt.schema.ValidationMessage;
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
@RequestMapping("/completed-claim")
public class CompletedClaimController {

    private final ClaimStorageService claimStorageService;
    private final ClaimValidatorService claimValidatorService;

    @Autowired
    public CompletedClaimController(
            ClaimStorageService claimStorageService, ClaimValidatorService claimValidatorService) {
        this.claimStorageService = claimStorageService;
        this.claimValidatorService = claimValidatorService;
    }

    public ResponseEntity<String> makeErrorEntity(String message) {
        return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping()
    public ResponseEntity<String> saveCompletedClaim(
            @RequestBody Map<String, Object> completedClaimPayload) {
        // TODO: Get claimant id from session and use that instead of the idp_id when auth is in
        //       place. For now, just make up a static IdpId and use that for all claims
        String claimantIdpId = "test_id";

        // TODO: validate claim against the schema
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            Set<ValidationMessage> errorSet =
                    claimValidatorService.validateAgainstSchema(
                            objectMapper.writeValueAsString(completedClaimPayload));
            if (errorSet.size() > 0) {
                // TODO - change here when detailed error msgs are desired on the fronted
                return makeErrorEntity(
                        "Save failed, the schema was the correct JSON format but had invalid"
                                + " data.");
            }

        } catch (Exception e) {

            return makeErrorEntity(
                    "Save failed, error occured accessing schema with IO or invalid JSON was"
                            + " received");
        }
        var saveStatus = claimStorageService.saveClaim(claimantIdpId, completedClaimPayload);

        if (saveStatus) {
            return new ResponseEntity<>("Save successful", HttpStatus.OK);
        } else {
            return makeErrorEntity("Save failed");
        }
    }
}

package nj.lwd.ui.claimantintake.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import nj.lwd.ui.claimantintake.dto.CompleteClaimResponseBody;
import nj.lwd.ui.claimantintake.exception.ClaimDataRetrievalException;
import nj.lwd.ui.claimantintake.service.ClaimStorageService;
import nj.lwd.ui.claimantintake.service.ClaimValidatorService;
import nj.lwd.ui.claimantintake.service.ExternalClaimFormatterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<CompleteClaimResponseBody> saveCompletedClaim(
            @RequestBody Map<String, Object> completedClaimPayload, Authentication authentication) {
        String claimantIdpId = authentication.getName();

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            Map<String, Object> externalClaim =
                    externalClaimFormatterService.formatClaim(completedClaimPayload, claimantIdpId);
            List<String> errorList =
                    claimValidatorService.validateAgainstSchema(
                            objectMapper.writeValueAsString(externalClaim));

            if (!errorList.isEmpty()) {
                CompleteClaimResponseBody response =
                        new CompleteClaimResponseBody(
                                "Errors occurred when validating the claim data", errorList);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

        } catch (IOException e) {
            CompleteClaimResponseBody response =
                    new CompleteClaimResponseBody(
                            "Save failed, error occurred accessing or reading the schema on the"
                                    + " server side",
                            null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        var saveStatus = claimStorageService.completeClaim(claimantIdpId, completedClaimPayload);

        String message;
        HttpStatus status;
        if (saveStatus) {
            status = HttpStatus.OK;
            message = "Save successful";

        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = "Save failed";
        }

        CompleteClaimResponseBody response = new CompleteClaimResponseBody(message, null);
        return new ResponseEntity<>(response, status);
    }

    @GetMapping()
    public ResponseEntity<Map<String, Object>> getCompleteClaim(Authentication authentication)
            throws ClaimDataRetrievalException {
        String claimantIdpId = authentication.getName();

        Optional<Map<String, Object>> claimData =
                claimStorageService.getCompleteClaim(claimantIdpId);

        if (claimData.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().body(claimData.get());
    }
}

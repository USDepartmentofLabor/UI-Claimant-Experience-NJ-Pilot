package nj.lwd.ui.claimantintake.controller;

import java.util.Map;
import nj.lwd.ui.claimantintake.service.ClaimStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/partial-claim")
public class PartialClaimController {

    private final ClaimStorageService claimStorageService;

    @Autowired
    public PartialClaimController(ClaimStorageService claimStorageService) {
        this.claimStorageService = claimStorageService;
    }

    @PostMapping()
    public ResponseEntity<String> savePartialClaim(
            @RequestBody Map<String, Object> partialClaimPayload) {
        // TODO: Get claimant id from session and use that instead of the idp_id when auth is in
        //       place. For now, just make up a static IdpId and use that for all claims
        String claimantIdpId = "test_id";

        var saveStatus = claimStorageService.saveClaim(claimantIdpId, partialClaimPayload);

        if (saveStatus) {
            return new ResponseEntity<>("Save successful", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Save failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

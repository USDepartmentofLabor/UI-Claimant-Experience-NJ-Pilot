package nj.lwd.ui.claimantintake.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import nj.lwd.ui.claimantintake.exception.ClaimDataRetrievalException;
import nj.lwd.ui.claimantintake.service.ClaimStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
            @RequestBody Map<String, Object> partialClaimPayload, Authentication authentication) {
        String claimantIdpId = authentication.getName();

        var saveStatus = claimStorageService.saveClaim(claimantIdpId, partialClaimPayload);

        if (saveStatus) {
            return new ResponseEntity<>("Save successful", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Save failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping()
    public ResponseEntity<Map<String, Object>> getPartialClaim(Authentication authentication)
            throws ClaimDataRetrievalException {
        String claimantIdpId = authentication.getName();
        Optional<Map<String, Object>> claimData =
                claimStorageService.getPartialClaim(claimantIdpId);
        return ResponseEntity.ok().body(claimData.orElse(new HashMap<>()));
    }
}

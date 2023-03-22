package nj.lwd.ui.claimantintake.controller;

import nj.lwd.ui.claimantintake.service.BetaTestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/beta-test")
public class BetaTestController {

    private final BetaTestService betaTestService;

    @Autowired
    public BetaTestController(BetaTestService betaTestService) {
        this.betaTestService = betaTestService;
    }

    @PostMapping("/submit")
    ResponseEntity<String> betaSubmit(
            @RequestBody String htmlArtifact, Authentication authentication) {
        var claimantIdpId = authentication.getName();
        var result = betaTestService.storeClaimArtifact(claimantIdpId, htmlArtifact);

        if (!result.isSuccess()) {
            return new ResponseEntity<>(result.getMessage(), result.getStatus());
        }

        return new ResponseEntity<>(result.getStatus());
    }
}

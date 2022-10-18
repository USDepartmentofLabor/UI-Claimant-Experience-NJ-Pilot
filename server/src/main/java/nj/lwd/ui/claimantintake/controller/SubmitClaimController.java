package nj.lwd.ui.claimantintake.controller;

import java.util.Map;
import nj.lwd.ui.claimantintake.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/submit")
public class SubmitClaimController {

    private final SubmissionService submissionService;

    @Autowired
    public SubmitClaimController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @PostMapping()
    public ResponseEntity<String> submitClaim(Map<String, Object> completedClaimPayload) {
        boolean navaAPISuccess = submissionService.submitClaim(completedClaimPayload);
        System.out.println("nava success is " + navaAPISuccess);
        if (navaAPISuccess) {
            return new ResponseEntity<>("Save successful", HttpStatus.OK);
        }
        return new ResponseEntity<>("Unable to submit claim.", HttpStatus.BAD_REQUEST);
    }
}

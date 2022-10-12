package nj.lwd.ui.claimantintake.service;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.Test;

public class SubmissionServiceTest {

    // TODO - both testcases should be changed when the NAVA api is connected
    @Test
    void submitWithValidData() throws Exception {
        SubmissionService submissionService = new SubmissionService();
        Map<String, String> claimantName =
                new HashMap<String, String>() {
                    {
                        put("first_name", "Harry");
                        put("last_name", "Potter");
                    }
                };
        Map<String, Object> validClaim =
                new HashMap<String, Object>() {
                    {
                        put("claimant_name", claimantName);
                    }
                };

        boolean isSucess = submissionService.submitClaim(validClaim);
        assertTrue(isSucess);
    }

    @Test
    void submitWithInvalidData() throws Exception {

        SubmissionService submissionService = new SubmissionService();
        Map<String, Object> invalidClaim =
                new HashMap<String, Object>() {
                    {
                        put("first_name", "Harry");
                        put("last_name", "Potter");
                    }
                };

        boolean isSucess = submissionService.submitClaim(invalidClaim);
        assertTrue(isSucess);
    }
}

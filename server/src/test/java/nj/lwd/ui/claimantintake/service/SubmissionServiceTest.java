package nj.lwd.ui.claimantintake.service;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import nj.lwd.ui.claimantintake.constants.ClaimEventCategory;
import nj.lwd.ui.claimantintake.model.Claim;
import nj.lwd.ui.claimantintake.model.Claimant;
import nj.lwd.ui.claimantintake.repository.ClaimantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

public class SubmissionServiceTest {
    @Mock private ClaimantRepository claimantRepository;
    // TODO - both testcases should be changed when the NAVA api is connected

    private SubmissionService submissionService;

    @BeforeEach
    void beforeEach() {
        submissionService = new SubmissionService(claimantRepository);
    }

    @Test
    void submitWithValidData() throws Exception {
        var claimantId = UUID.randomUUID();
        var claimId = UUID.randomUUID();
        var claimant = mock(Claimant.class);
        var claim = mock(Claim.class);
        when(claimant.getId()).thenReturn(claimantId);
        when(claim.getId()).thenReturn(claimId);
        when(claimant.getActiveCompletedClaim()).thenReturn(Optional.of(claim));
        when(claimantRepository.findClaimantByIdpId(anyString())).thenReturn(Optional.of(claimant));
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> validClaim =
                objectMapper.readValue(
                        """
                        {
                          "claimant_name": {
                            "first_name": "Harry",
                            "last_name": "Potter",
                            "middle_initial": "J"
                          }
                        }
                        """,
                        new TypeReference<>() {});

        boolean isSucess = submissionService.submitClaim(validClaim, "test_id");
        verify(claim, times(1))
                .addEvent(
                        argThat(
                                event ->
                                        event.getCategory()
                                                == ClaimEventCategory.INITIATED_SUBMIT));
        verify(claim, times(1))
                .addEvent(argThat(event -> event.getCategory() == ClaimEventCategory.SUBMITTED));

        assertTrue(isSucess);
    }

    @Test
    void submitWithInvalidData() throws Exception {

        Map<String, Object> invalidClaim =
                new HashMap<String, Object>() {
                    {
                        put("first_name", "Harry");
                        put("last_name", "Potter");
                    }
                };

        boolean isSuccess = submissionService.submitClaim(invalidClaim, "test_id");
        // check that initiated was set
        // check that sumitted failed was set
        // check post was called?
        assertTrue(isSuccess);
    }

    @Test
    void submitWithEmptyData() throws Exception {

        Map<String, Object> invalidClaim =
                new HashMap<String, Object>() {
                    {
                        put("first_name", "Harry");
                        put("last_name", "Potter");
                    }
                };

        boolean isSuccess = submissionService.submitClaim(invalidClaim, "test_id");
        // check that initiated was set
        // check that sumitted failed was set
        // check post was called?
        assertTrue(isSuccess);
    }
}

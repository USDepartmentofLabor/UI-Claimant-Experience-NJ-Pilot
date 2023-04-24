package nj.lwd.ui.claimantintake.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import nj.lwd.ui.claimantintake.constants.ClaimEventCategory;
import nj.lwd.ui.claimantintake.model.Claim;
import nj.lwd.ui.claimantintake.model.Claimant;
import nj.lwd.ui.claimantintake.repository.ClaimantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SubmissionServiceTest {
    @Mock private ClaimantRepository claimantRepository;
    @Mock private ExternalClaimFormatterService externalClaimFormatterService;
    // TODO - both testcases should be changed when the NAVA api is connected

    private SubmissionService submissionService;

    private final Map<String, Object> validClaim =
            (new ObjectMapper())
                    .readValue(
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
    private final Map<String, Object> invalidClaim =
            (new ObjectMapper())
                    .readValue(
                            """
                    {
                      "claimant_name": {
                        "first_name": "Harry"
                      },
                      "alternate_phone":{
                        "number":"000111111"
                      }
                    }
                    """,
                            new TypeReference<>() {});

    SubmissionServiceTest() throws JsonProcessingException {}

    @BeforeEach
    void beforeEach() {
        submissionService =
                new SubmissionService(claimantRepository, externalClaimFormatterService);
    }

    @Test
    void submitWithoutPreExistingClaim() throws Exception {
        var claimant = mock(Claimant.class);
        var claim = mock(Claim.class);

        // set claimant to not have a claim yet
        when(externalClaimFormatterService.formatClaim(any(), anyString())).thenReturn(validClaim);
        when(claimant.getActiveCompletedClaim()).thenReturn(Optional.empty());
        when(claimantRepository.findClaimantByIdpId(anyString())).thenReturn(Optional.of(claimant));

        boolean isSucess = submissionService.submitClaim(validClaim, "test_id");

        verify(claim, times(0))
                .addEvent(
                        argThat(
                                event ->
                                        event.getCategory()
                                                == ClaimEventCategory.INITIATED_SUBMIT));
        verify(claim, times(0))
                .addEvent(
                        argThat(
                                (event) ->
                                        event.getCategory().equals(ClaimEventCategory.SUBMITTED)));
        verify(claim, times(0))
                .addEvent(
                        argThat(
                                (event) ->
                                        event.getCategory()
                                                .equals(ClaimEventCategory.SUBMIT_FAILED)));

        assertFalse(isSucess);
    }

    @Test
    void submitWithValidData() throws Exception {
        var claimantId = UUID.randomUUID();
        var claimId = UUID.randomUUID();
        var claimant = mock(Claimant.class);
        var claim = mock(Claim.class);

        when(externalClaimFormatterService.formatClaim(any(), anyString())).thenReturn(validClaim);
        when(claimant.getId()).thenReturn(claimantId);
        when(claim.getId()).thenReturn(claimId);
        when(claimant.getActiveCompletedClaim()).thenReturn(Optional.of(claim));
        when(claimantRepository.findClaimantByIdpId(anyString())).thenReturn(Optional.of(claimant));

        boolean isSucess = submissionService.submitClaim(validClaim, "test_id");

        verify(claim, times(1))
                .addEvent(
                        argThat(
                                event ->
                                        event.getCategory()
                                                == ClaimEventCategory.INITIATED_SUBMIT));
        verify(claim, times(1))
                .addEvent(
                        argThat(
                                (event) ->
                                        event.getCategory().equals(ClaimEventCategory.SUBMITTED)));

        verify(claim, times(0))
                .addEvent(
                        argThat(
                                (event) ->
                                        event.getCategory()
                                                .equals(ClaimEventCategory.SUBMIT_FAILED)));

        assertTrue(isSucess);
    }

    @Test
    void submitWithInvalidData() throws Exception {
        // Tests forcing the Nava api to return false
        var claimantId = UUID.randomUUID();
        var claimId = UUID.randomUUID();
        var claimant = mock(Claimant.class);
        var claim = mock(Claim.class);

        when(externalClaimFormatterService.formatClaim(any(), anyString()))
                .thenReturn(invalidClaim);
        when(claimant.getId()).thenReturn(claimantId);
        when(claim.getId()).thenReturn(claimId);
        when(claimant.getActiveCompletedClaim()).thenReturn(Optional.of(claim));
        when(claimantRepository.findClaimantByIdpId(anyString())).thenReturn(Optional.of(claimant));

        boolean isSuccess = submissionService.submitClaim(invalidClaim, "test_id");

        verify(claim, times(1))
                .addEvent(
                        argThat(
                                event ->
                                        event.getCategory()
                                                == ClaimEventCategory.INITIATED_SUBMIT));
        verify(claim, times(0))
                .addEvent(
                        argThat(
                                (event) ->
                                        event.getCategory().equals(ClaimEventCategory.SUBMITTED)));
        verify(claim, times(1))
                .addEvent(
                        argThat(
                                (event) ->
                                        event.getCategory()
                                                .equals(ClaimEventCategory.SUBMIT_FAILED)));

        assertFalse(isSuccess);
    }
}

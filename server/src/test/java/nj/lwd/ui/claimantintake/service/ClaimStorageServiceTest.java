package nj.lwd.ui.claimantintake.service;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
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
import nj.lwd.ui.claimantintake.repository.ClaimRepository;
import nj.lwd.ui.claimantintake.repository.ClaimantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ClaimStorageServiceTest {

    private static final String CLAIMS_BUCKET = "dol-ui-claims";

    @Mock private ClaimantRepository claimantRepository;
    @Mock private ClaimRepository claimRepository;
    @Mock private S3Service s3Service;

    private ClaimStorageService claimStorageService;

    @BeforeEach
    void beforeEach() {
        claimStorageService =
                new ClaimStorageService(
                        CLAIMS_BUCKET, s3Service, claimRepository, claimantRepository);
    }

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, Object> validClaim =
            objectMapper.readValue(
                    """
                            {
                              "claimant_name": {
                                "first_name": "Joan",
                                "last_name": "Jett",
                                "middle_name": "Rockstar",
                                "suffix": "Jr."
                              }
                            }
                            """,
                    new TypeReference<>() {});

    ClaimStorageServiceTest() throws JsonProcessingException {}

    @Test
    void saveClaimSavesNewClaimInDbAndS3() throws Exception {
        // given: an existing claimant that does not have a partial claim
        var claimant = mock(Claimant.class);
        var claimantId = UUID.randomUUID();
        when(claimant.getId()).thenReturn(claimantId);
        when(claimant.getActivePartialClaim()).thenReturn(Optional.empty());
        when(claimantRepository.findClaimantByIdpId(anyString())).thenReturn(Optional.of(claimant));

        // and: a new claim that will be created and saved
        var claim = mock(Claim.class);
        var claimId = UUID.randomUUID();
        when(claim.getId()).thenReturn(claimId);
        when(claimRepository.save(any(Claim.class))).thenReturn(claim);

        var expectedS3Key = "%s/%s.json".formatted(claimantId, claimId);

        // when: saveClaim is called
        var result = claimStorageService.saveClaim("some-id", validClaim);

        // then: the new claim should be saved with appropriate events added
        assertTrue(result);

        verify(claimRepository, times(1)).save(any(Claim.class));

        verify(claim, times(1))
                .addEvent(
                        argThat(
                                (event) ->
                                        event.getCategory()
                                                .equals(ClaimEventCategory.INITIATED_SAVE)));

        verify(s3Service, times(1)).upload(CLAIMS_BUCKET, expectedS3Key, validClaim);

        verify(claim, times(1))
                .addEvent(argThat((event) -> event.getCategory().equals(ClaimEventCategory.SAVED)));

        verify(claim, times(0))
                .addEvent(
                        argThat(
                                (event) ->
                                        event.getCategory()
                                                .equals(ClaimEventCategory.SAVE_FAILED)));

        verify(claimantRepository, times(1)).save(claimant);
    }

    @Test
    void saveClaimOverwritesExistingPartialClaimInDbAndS3() throws Exception {
        // given: an existing partial claim
        var claim = mock(Claim.class);
        var claimId = UUID.randomUUID();
        when(claim.getId()).thenReturn(claimId);

        // and: a claimant that owns the claim
        var claimant = mock(Claimant.class);
        var claimantId = UUID.randomUUID();
        when(claimant.getId()).thenReturn(claimantId);
        when(claimant.getActivePartialClaim()).thenReturn(Optional.of(claim));
        when(claimantRepository.findClaimantByIdpId(anyString())).thenReturn(Optional.of(claimant));

        var expectedS3Key = "%s/%s.json".formatted(claimantId, claimId);

        // when: saveClaim is called
        var result = claimStorageService.saveClaim("some-id", validClaim);

        // then: the existing claim should be saved
        assertTrue(result);

        verify(claimRepository, times(0)).save(any(Claim.class));

        verify(claim, times(1))
                .addEvent(
                        argThat(
                                (event) ->
                                        event.getCategory()
                                                .equals(ClaimEventCategory.INITIATED_SAVE)));

        verify(s3Service, times(1)).upload(CLAIMS_BUCKET, expectedS3Key, validClaim);

        verify(claim, times(1))
                .addEvent(argThat((event) -> event.getCategory().equals(ClaimEventCategory.SAVED)));

        verify(claim, times(0))
                .addEvent(
                        argThat(
                                (event) ->
                                        event.getCategory()
                                                .equals(ClaimEventCategory.SAVE_FAILED)));

        verify(claimantRepository, times(1)).save(claimant);
    }
}

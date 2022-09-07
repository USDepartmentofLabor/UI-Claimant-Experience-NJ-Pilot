package nj.lwd.ui.claimantintake.service;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import java.util.Optional;
import nj.lwd.ui.claimantintake.constants.ClaimEventCategory;
import nj.lwd.ui.claimantintake.model.Claim;
import nj.lwd.ui.claimantintake.model.Claimant;
import nj.lwd.ui.claimantintake.repository.ClaimantRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ClaimStorageServiceTest {

    @Mock private ClaimantRepository claimantRepository;

    @InjectMocks private ClaimStorageService claimStorageService;

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
    void saveClaimSavesInDbAndS3() throws Exception {
        // given:
        var claimant = mock(Claimant.class);
        var claim = mock(Claim.class);
        when(claimant.getActivePartialClaim()).thenReturn(Optional.of(claim));
        when(claimantRepository.findClaimantByIdpId(anyString())).thenReturn(Optional.of(claimant));

        // when:
        var result = claimStorageService.saveClaim("some-id", validClaim);

        // then:
        assertTrue(result);

        verify(claim, times(1))
                .addEvent(
                        argThat(
                                (event) ->
                                        event.getCategory()
                                                .equals(ClaimEventCategory.INITIATED_SAVE)));

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

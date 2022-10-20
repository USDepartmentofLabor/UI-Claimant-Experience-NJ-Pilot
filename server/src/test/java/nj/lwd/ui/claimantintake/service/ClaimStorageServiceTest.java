package nj.lwd.ui.claimantintake.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.NoSuchElementException;
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
import software.amazon.awssdk.awscore.exception.AwsServiceException;

@ExtendWith(MockitoExtension.class)
class ClaimStorageServiceTest {

    private static final String CLAIMS_BUCKET = "dol-ui-claims";
    private static final String CLAIMS_BUCKET_KMS_KEY = "localdev-mock-kms-key";

    @Mock private ClaimantRepository claimantRepository;
    @Mock private ClaimRepository claimRepository;
    @Mock private S3Service s3Service;

    private ClaimStorageService claimStorageService;

    @BeforeEach
    void beforeEach() {
        claimStorageService =
                new ClaimStorageService(
                        CLAIMS_BUCKET,
                        CLAIMS_BUCKET_KMS_KEY,
                        s3Service,
                        claimRepository,
                        claimantRepository);
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
    void completeClaimFailsIfNoClaimantExists() throws Exception {
        when(claimantRepository.findClaimantByIdpId(anyString())).thenReturn(Optional.empty());

        var result = claimStorageService.completeClaim("test-id", validClaim);

        assertFalse(result);

        verify(claimantRepository, times(1)).findClaimantByIdpId("test-id");
        verify(s3Service, times(0)).upload(anyString(), anyString(), any(), anyString());
    }

    @Test
    void completeClaimFailsWhenCannotSaveToS3() throws Exception {
        var claimant = mock(Claimant.class);
        var claim = mock(Claim.class);
        var claimantId = UUID.randomUUID();
        var claimId = UUID.randomUUID();
        var expectedS3Key = "%s/%s.json".formatted(claimantId, claimId);

        when(claimant.getId()).thenReturn(claimantId);
        when(claim.getId()).thenReturn(claimId);
        when(claimant.getActivePartialClaim()).thenReturn(Optional.of(claim));
        when(claimantRepository.findClaimantByIdpId(anyString())).thenReturn(Optional.of(claimant));

        doThrow(AwsServiceException.builder().build())
                .when(s3Service)
                .upload(anyString(), anyString(), any(), anyString());

        var result = claimStorageService.completeClaim("test-id", validClaim);

        assertFalse(result);

        verify(claimantRepository, times(1)).findClaimantByIdpId("test-id");
        verify(s3Service, times(1))
                .upload(CLAIMS_BUCKET, expectedS3Key, validClaim, CLAIMS_BUCKET_KMS_KEY);

        verify(claim, times(1))
                .addEvent(
                        argThat(
                                event ->
                                        event.getCategory()
                                                == ClaimEventCategory.INITIATED_COMPLETE));
        verify(claim, times(1))
                .addEvent(
                        argThat(event -> event.getCategory() == ClaimEventCategory.INITIATED_SAVE));
        verify(claim, times(1))
                .addEvent(argThat(event -> event.getCategory() == ClaimEventCategory.SAVE_FAILED));
        verify(claim, times(1))
                .addEvent(
                        argThat(
                                event ->
                                        event.getCategory() == ClaimEventCategory.COMPLETE_FAILED));
    }

    @Test
    void completeClaimSucceedsWithActivePartialClaim() throws Exception {
        var claimant = mock(Claimant.class);
        var claim = mock(Claim.class);
        var claimantId = UUID.randomUUID();
        var claimId = UUID.randomUUID();
        var expectedS3Key = "%s/%s.json".formatted(claimantId, claimId);

        when(claimant.getId()).thenReturn(claimantId);
        when(claim.getId()).thenReturn(claimId);
        when(claimant.getActivePartialClaim()).thenReturn(Optional.of(claim));
        when(claimantRepository.findClaimantByIdpId(anyString())).thenReturn(Optional.of(claimant));

        var result = claimStorageService.completeClaim("test-id", validClaim);

        assertTrue(result);

        verify(s3Service, times(1))
                .upload(CLAIMS_BUCKET, expectedS3Key, validClaim, CLAIMS_BUCKET_KMS_KEY);

        verify(claim, times(1))
                .addEvent(
                        argThat(
                                event ->
                                        event.getCategory()
                                                == ClaimEventCategory.INITIATED_COMPLETE));
        verify(claim, times(1))
                .addEvent(
                        argThat(event -> event.getCategory() == ClaimEventCategory.INITIATED_SAVE));
        verify(claim, times(1))
                .addEvent(argThat(event -> event.getCategory() == ClaimEventCategory.SAVED));
        verify(claim, times(1))
                .addEvent(argThat(event -> event.getCategory() == ClaimEventCategory.COMPLETED));
    }

    @Test
    void completeClaimSucceedsWithNewClaim() throws Exception {
        var claimant = mock(Claimant.class);
        var claim = mock(Claim.class);
        var claimantId = UUID.randomUUID();
        var claimId = UUID.randomUUID();
        var expectedS3Key = "%s/%s.json".formatted(claimantId, claimId);

        when(claimant.getId()).thenReturn(claimantId);
        when(claim.getId()).thenReturn(claimId);
        when(claimant.getActivePartialClaim()).thenReturn(Optional.empty());
        when(claimantRepository.findClaimantByIdpId(anyString())).thenReturn(Optional.of(claimant));
        when(claimRepository.save(any())).thenReturn(claim);

        var result = claimStorageService.completeClaim("test-id", validClaim);

        assertTrue(result);

        verify(s3Service, times(1))
                .upload(CLAIMS_BUCKET, expectedS3Key, validClaim, CLAIMS_BUCKET_KMS_KEY);
        verify(claimRepository, times(1)).save(any());

        verify(claim, times(1))
                .addEvent(
                        argThat(
                                event ->
                                        event.getCategory()
                                                == ClaimEventCategory.INITIATED_COMPLETE));
        verify(claim, times(1))
                .addEvent(
                        argThat(event -> event.getCategory() == ClaimEventCategory.INITIATED_SAVE));
        verify(claim, times(1))
                .addEvent(argThat(event -> event.getCategory() == ClaimEventCategory.SAVED));
        verify(claim, times(1))
                .addEvent(argThat(event -> event.getCategory() == ClaimEventCategory.COMPLETED));
    }

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

        verify(s3Service, times(1))
                .upload(CLAIMS_BUCKET, expectedS3Key, validClaim, CLAIMS_BUCKET_KMS_KEY);

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

        verify(s3Service, times(1))
                .upload(CLAIMS_BUCKET, expectedS3Key, validClaim, CLAIMS_BUCKET_KMS_KEY);

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
    void getClaimReturnsPartialClaimData() throws Exception {
        Claimant claimant = mock(Claimant.class);
        Claim claim = mock(Claim.class);

        when(claimantRepository.findClaimantByIdpId(anyString())).thenReturn(Optional.of(claimant));
        when(claimant.getActivePartialClaim()).thenReturn(Optional.of(claim));

        UUID claimantId = UUID.randomUUID();
        UUID claimId = UUID.randomUUID();

        when(claimant.getId()).thenReturn(claimantId);
        when(claim.getId()).thenReturn(claimId);

        InputStream inputStream =
                new ByteArrayInputStream(
                        "{\"ssn\": \"123456789\"}".getBytes(StandardCharsets.UTF_8));
        when(s3Service.get(CLAIMS_BUCKET, "%s/%s.json".formatted(claimantId, claimId)))
                .thenReturn(inputStream);

        Optional<Map<String, Object>> claimDataMapOptional = claimStorageService.getClaim("fakeid");

        assertTrue(claimDataMapOptional.isPresent());
        Map<String, Object> claimDataMap = claimDataMapOptional.get();

        assertTrue(claimDataMap.containsKey("ssn"));
        assertEquals("123456789", claimDataMap.get("ssn"));

        verify(s3Service, times(1)).get(CLAIMS_BUCKET, "%s/%s.json".formatted(claimantId, claimId));
    }

    @Test
    void getClaimReturnsNoDataWhenObjectDoesNotExistInS3() {
        Claimant claimant = mock(Claimant.class);
        Claim claim = mock(Claim.class);

        when(claimantRepository.findClaimantByIdpId(anyString())).thenReturn(Optional.of(claimant));
        when(claimant.getActivePartialClaim()).thenReturn(Optional.of(claim));

        UUID claimantId = UUID.randomUUID();
        UUID claimId = UUID.randomUUID();

        when(claimant.getId()).thenReturn(claimantId);
        when(claim.getId()).thenReturn(claimId);

        when(s3Service.get(CLAIMS_BUCKET, "%s/%s.json".formatted(claimantId, claimId)))
                .thenThrow(AwsServiceException.class);
        assertTrue(claimStorageService.getClaim("fakeid").isEmpty());

        verify(s3Service, times(1)).get(CLAIMS_BUCKET, "%s/%s.json".formatted(claimantId, claimId));
    }

    @Test
    void getClaimReturnsNoDataWhenNoClaimant() throws Exception {
        Optional<Claimant> optionalEmpty = spy(Optional.empty());
        when(claimantRepository.findClaimantByIdpId("fake id")).thenReturn(optionalEmpty);

        assertTrue(claimStorageService.getClaim("fake id").isEmpty());

        verify(optionalEmpty, times(1))
                .orElseThrow(
                        argThat(
                                (event) -> {
                                    return event.get().getClass() == NoSuchElementException.class;
                                }));

        verify(s3Service, times(0)).get(anyString(), anyString());
    }

    @Test
    void getClaimReturnsNoDataWhenNoExistingPartialClaim() throws Exception {
        Claimant claimant = mock(Claimant.class);
        Optional<Claim> optionalEmpty = spy(Optional.empty());
        when(claimantRepository.findClaimantByIdpId("fake id")).thenReturn(Optional.of(claimant));
        when(claimant.getActivePartialClaim()).thenReturn(optionalEmpty);

        assertTrue(claimStorageService.getClaim("fake id").isEmpty());

        verify(optionalEmpty, times(1))
                .orElseThrow(
                        argThat(
                                (event) -> {
                                    return event.get().getClass() == NoSuchElementException.class;
                                }));

        verify(s3Service, times(0)).get(anyString(), anyString());
    }
}

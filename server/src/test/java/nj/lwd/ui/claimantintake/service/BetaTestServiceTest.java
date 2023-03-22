package nj.lwd.ui.claimantintake.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.UUID;
import nj.lwd.ui.claimantintake.constants.ClaimEventCategory;
import nj.lwd.ui.claimantintake.model.Claim;
import nj.lwd.ui.claimantintake.model.Claimant;
import nj.lwd.ui.claimantintake.repository.ClaimRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.core.exception.SdkClientException;

@ExtendWith(MockitoExtension.class)
class BetaTestServiceTest {
    private static final String CLAIMS_BUCKET = "dol-ui-claims";
    private static final String CLAIMS_BUCKET_KMS_KEY = "localdev-mock-kms-key";
    private static final String HTML = "<html />";

    @Mock private S3Service s3Service;
    @Mock private ClaimantStorageService claimantStorageService;
    @Mock private ClaimRepository claimRepository;

    private BetaTestService betaTestService;

    @BeforeEach
    void beforeEach() {
        betaTestService =
                new BetaTestService(
                        CLAIMS_BUCKET,
                        CLAIMS_BUCKET_KMS_KEY,
                        s3Service,
                        claimantStorageService,
                        claimRepository);
    }

    @Test
    void storeClaimArtifactFailsIfUserIsNotAClaimant() {
        var idpId = "idpId";
        when(claimantStorageService.getClaimant(idpId)).thenReturn(Optional.empty());

        var response = betaTestService.storeClaimArtifact(idpId, HTML);

        assertFalse(response.isSuccess());
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatus());
        assertNotNull(response.getMessage());
    }

    @Test
    void storeClaimArtifactFailsIfClaimantDoesNotHaveACompletedClaim() {
        var idpId = "idpId";
        var claimant = mock(Claimant.class);
        when(claimant.getActiveCompletedClaim()).thenReturn(Optional.empty());

        when(claimantStorageService.getClaimant(idpId)).thenReturn(Optional.of(claimant));

        var response = betaTestService.storeClaimArtifact(idpId, HTML);

        assertFalse(response.isSuccess());
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatus());
        assertNotNull(response.getMessage());
    }

    @Test
    void storeClaimArtifactUploadsTheArtifactToS3() {
        var claim = mock(Claim.class);
        var claimId = UUID.randomUUID();
        when(claim.getId()).thenReturn(claimId);

        var expectedS3Key = "claims_inbox/%s/claim.html".formatted(claimId);

        var idpId = "idpId";
        var claimant = mock(Claimant.class);
        when(claimant.getActiveCompletedClaim()).thenReturn(Optional.of(claim));

        when(claimantStorageService.getClaimant(idpId)).thenReturn(Optional.of(claimant));

        var response = betaTestService.storeClaimArtifact(idpId, HTML);

        assertTrue(response.isSuccess());
        assertEquals(HttpStatus.OK, response.getStatus());
        assertNull(response.getMessage());

        verify(claim, times(1))
                .addEvent(
                        argThat(
                                event ->
                                        event.getCategory()
                                                == ClaimEventCategory.INITIATED_BETA_TEST_SUBMIT));
        verify(claim, times(1))
                .addEvent(
                        argThat(
                                event ->
                                        event.getCategory()
                                                == ClaimEventCategory.BETA_TEST_SUBMITTED));
        verify(s3Service, times(1))
                .upload(CLAIMS_BUCKET, expectedS3Key, HTML, CLAIMS_BUCKET_KMS_KEY);
        verify(claimRepository, times(1)).save(claim);
    }

    @Test
    void storeClaimArtifactHandlesAwsServiceExceptions() {
        var claim = mock(Claim.class);
        var claimId = UUID.randomUUID();
        when(claim.getId()).thenReturn(claimId);

        var expectedS3Key = "claims_inbox/%s/claim.html".formatted(claimId);

        var idpId = "idpId";
        var claimant = mock(Claimant.class);
        when(claimant.getActiveCompletedClaim()).thenReturn(Optional.of(claim));

        when(claimantStorageService.getClaimant(idpId)).thenReturn(Optional.of(claimant));

        doThrow(AwsServiceException.class)
                .when(s3Service)
                .upload(anyString(), anyString(), anyString(), anyString());

        var response = betaTestService.storeClaimArtifact(idpId, HTML);

        assertFalse(response.isSuccess());
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatus());
        assertNotNull(response.getMessage());

        verify(claim, times(1))
                .addEvent(
                        argThat(
                                event ->
                                        event.getCategory()
                                                == ClaimEventCategory.INITIATED_BETA_TEST_SUBMIT));
        verify(claim, times(1))
                .addEvent(
                        argThat(
                                event ->
                                        event.getCategory()
                                                == ClaimEventCategory.BETA_TEST_SUBMIT_FAILED));
        verify(s3Service, times(1))
                .upload(CLAIMS_BUCKET, expectedS3Key, HTML, CLAIMS_BUCKET_KMS_KEY);
        verify(claimRepository, times(1)).save(claim);
    }

    @Test
    void storeClaimArtifactHandlesSdkClientExceptions() {
        var claim = mock(Claim.class);
        var claimId = UUID.randomUUID();
        when(claim.getId()).thenReturn(claimId);

        var expectedS3Key = "claims_inbox/%s/claim.html".formatted(claimId);

        var idpId = "idpId";
        var claimant = mock(Claimant.class);
        when(claimant.getActiveCompletedClaim()).thenReturn(Optional.of(claim));

        when(claimantStorageService.getClaimant(idpId)).thenReturn(Optional.of(claimant));

        doThrow(SdkClientException.class)
                .when(s3Service)
                .upload(anyString(), anyString(), anyString(), anyString());

        var response = betaTestService.storeClaimArtifact(idpId, HTML);

        assertFalse(response.isSuccess());
        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, response.getStatus());
        assertNotNull(response.getMessage());

        verify(claim, times(1))
                .addEvent(
                        argThat(
                                event ->
                                        event.getCategory()
                                                == ClaimEventCategory.INITIATED_BETA_TEST_SUBMIT));
        verify(claim, times(1))
                .addEvent(
                        argThat(
                                event ->
                                        event.getCategory()
                                                == ClaimEventCategory.BETA_TEST_SUBMIT_FAILED));
        verify(s3Service, times(1))
                .upload(CLAIMS_BUCKET, expectedS3Key, HTML, CLAIMS_BUCKET_KMS_KEY);
        verify(claimRepository, times(1)).save(claim);
    }
}

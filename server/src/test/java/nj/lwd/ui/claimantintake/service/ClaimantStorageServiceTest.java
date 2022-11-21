package nj.lwd.ui.claimantintake.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Optional;
import nj.lwd.ui.claimantintake.model.Claimant;
import nj.lwd.ui.claimantintake.repository.ClaimantRepository;
import org.junit.jupiter.api.Test;

public class ClaimantStorageServiceTest {

    @Test
    void testGetOrCreateClaimant() {
        var claimantRepository = mock(ClaimantRepository.class);
        var claimantStorageService = new ClaimantStorageService(claimantRepository);
        String idpId = "test-idp-id";
        var claimant = new Claimant(idpId);
        when(claimantRepository.findClaimantByIdpId(idpId)).thenReturn(Optional.of(claimant));
        assertEquals(idpId, claimantStorageService.getOrCreateClaimant(idpId).getIdpId());
    }
}

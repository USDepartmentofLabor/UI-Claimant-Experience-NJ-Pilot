package nj.lwd.ui.claimantintake.model;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.Optional;
import nj.lwd.ui.claimantintake.constants.ClaimEventCategory;
import org.junit.jupiter.api.Test;

class ClaimantTest {

    @Test
    void constructorWithIdp() {
        String idpId = "ipd-test";
        var claimant = new Claimant(idpId);
        assertEquals(idpId, claimant.getIdpId());
    }

    @Test
    void canAddClaimToClaimant() {
        var claimant = new Claimant();
        var claim = new Claim();
        claimant.addClaim(claim);
        assertEquals(claimant, claim.getClaimant());
        assertEquals(1, claimant.getClaims().size());
    }

    @Test
    void canRemoveClaimFromClaimant() {
        var claimant = new Claimant();
        var claim = new Claim();
        claimant.addClaim(claim);
        assertEquals(claimant, claim.getClaimant());
        claimant.removeClaim(claim);
        assertNull(claim.getClaimant());
        assertEquals(0, claimant.getClaims().size());
    }

    @Test
    void hasPartialClaimReturnsFalseForNewClaimant() {
        var claimant = new Claimant();

        assertFalse(claimant.hasPartialClaim());
    }

    @Test
    void hasPartialClaimReturnsTrueForClaimantWithClaimNotCompleted() {
        var claimant = new Claimant();

        var claim = new Claim();
        claimant.addClaim(claim);

        assertTrue(claimant.hasPartialClaim());
    }

    @Test
    void hasCompleteClaimReturnsFalseForNewClaimant() {
        var claimant = new Claimant();

        assertFalse(claimant.hasCompleteClaim());
    }

    @Test
    void hasCompleteClaimReturnsTrueForClaimantWithCompletedClaim() {
        var claimant = new Claimant();

        var claim = new Claim();
        claim.addEvent(new ClaimEvent(ClaimEventCategory.COMPLETED));
        claimant.addClaim(claim);

        assertTrue(claimant.hasCompleteClaim());
    }

    @Test
    void getActivePartialClaimReturnsEmptyIfNoClaim() {
        var claimant = new Claimant();
        assertTrue(claimant.getActivePartialClaim().isEmpty());
    }

    @Test
    void getActiveCompletedClaimReturnsEmptyIfNoClaim() {
        var claimant = new Claimant();
        assertTrue(claimant.getActiveCompletedClaim().isEmpty());
    }

    @Test
    void getActiveCompletedClaimReturnsMostRecentCompletedClaim() {
        var claimant = new Claimant();

        // with an ancient completed claim
        var ancientCompletedClaim = mock(Claim.class);
        var ancientClaimEventCompleted = mock(ClaimEvent.class);
        when(ancientCompletedClaim.getLatestEventByCategory(ClaimEventCategory.COMPLETED))
                .thenReturn(Optional.of(ancientClaimEventCompleted));
        when(ancientClaimEventCompleted.getUpdatedAt())
                .thenReturn(Instant.now().minusSeconds(2000));
        when(ancientCompletedClaim.isComplete()).thenReturn(true);
        when(ancientCompletedClaim.isSubmitted()).thenReturn(false);

        // with an old completed claim
        var oldCompletedClaim = mock(Claim.class);
        var oldClaimEventCompleted = mock(ClaimEvent.class);
        when(oldCompletedClaim.getLatestEventByCategory(ClaimEventCategory.COMPLETED))
                .thenReturn(Optional.of(oldClaimEventCompleted));
        when(oldClaimEventCompleted.getUpdatedAt()).thenReturn(Instant.now().minusSeconds(600));
        when(oldCompletedClaim.isComplete()).thenReturn(true);
        when(oldCompletedClaim.isSubmitted()).thenReturn(false);

        claimant.addClaim(ancientCompletedClaim);
        claimant.addClaim(oldCompletedClaim);

        // when: getting the active completed claim
        var activeCompletedClaim = claimant.getActiveCompletedClaim();

        // then: the most recently updated completed claim should be returned
        assertTrue(activeCompletedClaim.isPresent());
        assertEquals(oldCompletedClaim, activeCompletedClaim.get());
    }

    @Test
    void getActivePartialClaimReturnsMostRecentlySavedPartialClaim() {
        // given:
        // a claimant
        var claimant = new Claimant();

        // with an ancient partial claim
        var ancientPartialClaim = mock(Claim.class);
        var ancientClaimEventSaved = mock(ClaimEvent.class);
        when(ancientPartialClaim.getLatestEventByCategory(ClaimEventCategory.SAVED))
                .thenReturn(Optional.of(ancientClaimEventSaved));
        when(ancientClaimEventSaved.getUpdatedAt()).thenReturn(Instant.now().minusSeconds(1000));

        // and an old partial claim
        var oldPartialClaim = mock(Claim.class);
        var oldClaimEventSaved = mock(ClaimEvent.class);
        when(oldPartialClaim.getLatestEventByCategory(ClaimEventCategory.SAVED))
                .thenReturn(Optional.of(oldClaimEventSaved));
        when(oldClaimEventSaved.getUpdatedAt()).thenReturn(Instant.now().minusSeconds(500));

        // and a recent partial claim
        var recentPartialClaim = mock(Claim.class);
        var recentClaimEventSaved = mock(ClaimEvent.class);
        when(recentPartialClaim.getLatestEventByCategory(ClaimEventCategory.SAVED))
                .thenReturn(Optional.of(recentClaimEventSaved));
        when(recentClaimEventSaved.getUpdatedAt()).thenReturn(Instant.now());

        claimant.addClaim(ancientPartialClaim);
        claimant.addClaim(oldPartialClaim);
        claimant.addClaim(recentPartialClaim);

        // when: getting the active partial claim
        var activePartialClaim = claimant.getActivePartialClaim();

        // then: the most recently saved claim should be returned
        assertTrue(activePartialClaim.isPresent());
        assertEquals(recentPartialClaim, activePartialClaim.get());
    }
}

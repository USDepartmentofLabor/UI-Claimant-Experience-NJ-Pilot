package nj.lwd.ui.claimantintake.model;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.Instant;
import nj.lwd.ui.claimantintake.constants.ClaimEventCategory;
import org.junit.jupiter.api.Test;

class ClaimTest {

    @Test
    void isCompleteReturnsFalseWhenNotAssociatedWithACompleteEvent() {
        var claim = new Claim();

        claim.addEvent(new ClaimEvent(ClaimEventCategory.INITIATED_SAVE));
        claim.addEvent(new ClaimEvent(ClaimEventCategory.SAVED));
        claim.addEvent(new ClaimEvent(ClaimEventCategory.INITIATED_COMPLETE));
        claim.addEvent(new ClaimEvent(ClaimEventCategory.COMPLETE_FAILED));

        assertFalse(claim.isComplete());
    }

    @Test
    void isCompleteReturnsTrueWhenAssociatedWithACompleteEvent() {
        var claim = new Claim();

        claim.addEvent(new ClaimEvent(ClaimEventCategory.INITIATED_SAVE));
        claim.addEvent(new ClaimEvent(ClaimEventCategory.SAVED));
        claim.addEvent(new ClaimEvent(ClaimEventCategory.INITIATED_COMPLETE));
        claim.addEvent(new ClaimEvent(ClaimEventCategory.COMPLETED));

        assertTrue(claim.isComplete());
    }

    @Test
    void isSubmittedReturnsFalseWhenNotAssociatedWithASubmittedEvent() {
        var claim = new Claim();
        assertFalse(claim.isSubmitted());
    }

    @Test
    void isSubmittedReturnsTrueWhenAssociatedWithASubmittedEvent() {
        var claim = new Claim();

        claim.addEvent(new ClaimEvent(ClaimEventCategory.SUBMITTED));

        assertTrue(claim.isSubmitted());
    }

    @Test
    void getLatestEventByCategory() {
        var claim = new Claim();

        var ancientEvent = mock(ClaimEvent.class);
        var oldEvent = mock(ClaimEvent.class);
        var recentEvent = mock(ClaimEvent.class);

        claim.addEvent(ancientEvent);
        claim.addEvent(oldEvent);
        claim.addEvent(recentEvent);

        when(ancientEvent.getCreatedAt()).thenReturn(Instant.now().minusSeconds(120));
        when(ancientEvent.getCategory()).thenReturn(ClaimEventCategory.SAVED);

        when(oldEvent.getCreatedAt()).thenReturn(Instant.now().minusSeconds(60));
        when(oldEvent.getCategory()).thenReturn(ClaimEventCategory.SAVED);

        var now = Instant.now();
        when(recentEvent.getCreatedAt()).thenReturn(now);
        when(recentEvent.getCategory()).thenReturn(ClaimEventCategory.SAVED);

        var latestSave = claim.getLatestEventByCategory(ClaimEventCategory.SAVED);

        assertTrue(latestSave.isPresent());
        assertEquals(now, latestSave.get().getCreatedAt());
    }
}

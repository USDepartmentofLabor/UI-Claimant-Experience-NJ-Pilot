package nj.lwd.ui.claimantintake.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import nj.lwd.ui.claimantintake.dto.RecentEmployersResponse;
import org.junit.jupiter.api.Test;

public class RecentEmployersServiceTest {
    @Test
    void returnsData() {
        RecentEmployersService recentEmployersService = new RecentEmployersService();
        RecentEmployersResponse returnVal =
                recentEmployersService.getRecentEmployerValues("fake snn", "fake claim date");

        assertTrue(returnVal != null);
        assertTrue(returnVal.getWagePotentialMonLookupResponseEmployerDtos() != null);
        assertEquals(3, returnVal.getWagePotentialMonLookupResponseEmployerDtos().size());
    }
}

package nj.lwd.ui.claimantintake.service;

import static org.junit.jupiter.api.Assertions.assertTrue;

import nj.lwd.ui.claimantintake.dto.RecentEmployers;
import org.junit.jupiter.api.Test;

public class RecentEmployersServiceTest {
    @Test
    void returnsData() {
        RecentEmployersService recentEmployersService = new RecentEmployersService();
        RecentEmployers returnVal =
                recentEmployersService.getRecentEmployerValues("fake snn", "fake claim date");

        assertTrue(returnVal != null);
    }
}

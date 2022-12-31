package nj.lwd.ui.claimantintake.service;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Map;
import org.junit.jupiter.api.Test;

public class RecentEmployersServiceTest {
    @Test
    void returnsData() {
        RecentEmployersService recentEmployersService = new RecentEmployersService();
        Map<String, Object> returnVal =
                recentEmployersService.getRecentEmployerValues("fake snn", "fake claim date");

        assertTrue(returnVal != null);
    }
}

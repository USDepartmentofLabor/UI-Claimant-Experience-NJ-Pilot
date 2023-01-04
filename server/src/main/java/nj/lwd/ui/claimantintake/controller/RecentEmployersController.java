package nj.lwd.ui.claimantintake.controller;

import com.nimbusds.jose.shaded.json.JSONObject;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Map;
import nj.lwd.ui.claimantintake.dto.RecentEmployers;
import nj.lwd.ui.claimantintake.service.ClaimStorageService;
import nj.lwd.ui.claimantintake.service.RecentEmployersService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/recent-employers")
public class RecentEmployersController {
    private final ClaimStorageService claimStorageService;
    private final RecentEmployersService recentEmployersService;
    private final Logger logger = LoggerFactory.getLogger(RecentEmployersController.class);

    @Autowired
    public RecentEmployersController(
            ClaimStorageService claimStorageService,
            RecentEmployersService recentEmployersService) {
        this.claimStorageService = claimStorageService;
        this.recentEmployersService = recentEmployersService;
    }

    public String getClaimDate() {
        return LocalDate.now()
                .with(TemporalAdjusters.previous(DayOfWeek.SUNDAY))
                .format(DateTimeFormatter.ofPattern("yyyy-dd-MM"));
    }

    @GetMapping()
    public ArrayList<Map<String, Object>> getRecentEmployers(Authentication authentication) {
        String claimantIdpId = authentication.getName();
        String ssn = claimStorageService.getSSN(claimantIdpId);
        if (ssn == null) {
            return new ArrayList<Map<String, Object>>();
        }
        // claimDate == Sunday prior to now
        // format yyyy-mm-dd
        // TODO-change this to get claimDate to be sunday prior to now
        String claimDate = getClaimDate();

        // hit WGPM api ({ssn: ssnNumber, claimDate } and get back employer data
        JSONObject recentEmployersResponse =
                recentEmployersService.getRecentEmployerValues(ssn, claimDate);

        RecentEmployers recentEmployers = new RecentEmployers(recentEmployersResponse);

        return recentEmployers.toMapping();
    }
}

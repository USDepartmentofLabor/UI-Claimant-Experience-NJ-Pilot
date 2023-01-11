package nj.lwd.ui.claimantintake.controller;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import nj.lwd.ui.claimantintake.dto.RecentEmployersResponse;
import nj.lwd.ui.claimantintake.dto.WagePotentialResponseEmployer;
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
    public ArrayList<WagePotentialResponseEmployer> getRecentEmployers(
            Authentication authentication) {
        String claimantIdpId = authentication.getName();
        String ssn = claimStorageService.getSSN(claimantIdpId);
        if (ssn == null) {
            logger.info("SSN was null for claim id {}", claimantIdpId);
            return new ArrayList<WagePotentialResponseEmployer>();
        }

        // create claim date as previous sunday
        String claimDate = getClaimDate();

        // hit WGPM api with ssnNumber, claimDate  and get back employer data
        RecentEmployersResponse recentEmployerResponse =
                recentEmployersService.getRecentEmployerValues(ssn, claimDate);

        // TODO - save the wgpm response in s3 here

        // Get just the list of employers and return to client
        ArrayList<WagePotentialResponseEmployer> employerList =
                recentEmployerResponse.getWagePotentialMonLookupResponseEmployerDtos();
        if (employerList == null) {
            logger.info(
                    "No employer list for claimid {} but ssn was found correctly", claimantIdpId);
            return new ArrayList<WagePotentialResponseEmployer>();
        }

        return employerList;
    }
}

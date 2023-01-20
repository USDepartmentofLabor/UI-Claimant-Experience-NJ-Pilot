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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
        // TODO- change this to be a service call
        // create claim date as previous sunday
        return LocalDate.now()
                .with(TemporalAdjusters.previous(DayOfWeek.SUNDAY))
                .format(DateTimeFormatter.ofPattern("yyyy-dd-MM"));
    }

    @GetMapping()
    public ResponseEntity<?> getRecentEmployers(Authentication authentication) {
        String claimantIdpId = authentication.getName();
        String ssn = claimStorageService.getSSN(claimantIdpId);
        if (ssn == null) {
            logger.info("SSN was null for claimant IdpId {}", claimantIdpId);
            return new ResponseEntity<>(
                    "SSN not found for given claimant, unable to complete request",
                    HttpStatus.BAD_REQUEST);
        }

        String claimDate = getClaimDate();

        // hit WGPM api with ssnNumber, claimDate  and get back employer data
        RecentEmployersResponse recentEmployerResponse =
                recentEmployersService.getRecentEmployerValues(ssn, claimDate);

        boolean savedEmployerData =
                claimStorageService.saveRecentEmployer(claimantIdpId, recentEmployerResponse);
        if (!savedEmployerData) {
            logger.error(
                    "Saving Recent Employer Response failed for claimant IdpId {}, returning an"
                            + " empty array to client",
                    claimantIdpId);
            return new ResponseEntity<>(
                    "Received recent employer response, but could not save",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // Get just the list of employers and return to client
        ArrayList<WagePotentialResponseEmployer> employerList =
                recentEmployerResponse.getWagePotentialMonLookupResponseEmployerDtos();
        if (employerList == null) {
            logger.info(
                    "No employer list for claimant IdpId {} but ssn was found correctly",
                    claimantIdpId);
            employerList = new ArrayList<WagePotentialResponseEmployer>();
        }

        return new ResponseEntity<>(employerList, HttpStatus.OK);
    }
}

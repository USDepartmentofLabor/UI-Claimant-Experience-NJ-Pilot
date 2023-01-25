package nj.lwd.ui.claimantintake.service;

import java.util.ArrayList;
import nj.lwd.ui.claimantintake.dto.RecentEmployersResponse;
import nj.lwd.ui.claimantintake.dto.WagePotentialMonLookupRequest;
import nj.lwd.ui.claimantintake.dto.WagePotentialResponseEmployer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class RecentEmployersService {
    private final Logger logger = LoggerFactory.getLogger(RecentEmployersService.class);

    public RecentEmployersResponse getRecentEmployerValues(String ssn, String claimDate) {
        WagePotentialMonLookupRequest request = new WagePotentialMonLookupRequest(ssn, claimDate);

        // TODO - delete everything below and send the wgpm api call
        // parameters for call are ssn and claimdate
        // get claim date here instead of in controller?
        logger.info("Calling recent employer service");
        WagePotentialResponseEmployer employer1 =
                new WagePotentialResponseEmployer(
                        null,
                        "PEABODY MA",
                        "P O BOX 6001",
                        "C/O TALX UC EXPRESS",
                        "DIRECT FUTURE MAIL",
                        "031143718000000",
                        "01961",
                        "EPIC COFFEE, INC",
                        null,
                        "6144151035",
                        "001");

        WagePotentialResponseEmployer employer2 =
                new WagePotentialResponseEmployer(
                        null,
                        "WASHINGTON DC",
                        "SUITE #2",
                        "2212 superhero street",
                        "The Hall of Justice",
                        "031143718000011",
                        "91121",
                        "Justice for All",
                        null,
                        "5554151012",
                        "001");

        WagePotentialResponseEmployer employer3 =
                new WagePotentialResponseEmployer(
                        null,
                        "Metropolis KS",
                        null,
                        "#7",
                        "123 Secret Identity Street",
                        "031143718000066",
                        "12345",
                        "Daily Planet",
                        null,
                        "1114151035",
                        "001");
        ArrayList<WagePotentialResponseEmployer> employerList = new ArrayList<>();
        employerList.add(employer1);
        employerList.add(employer2);
        employerList.add(employer3);

        // claimdate needs to be changed to handle the 13 digit long epock timestamp it receives
        RecentEmployersResponse recentEmployerResponse =
                new RecentEmployersResponse(
                        "0",
                        false,
                        false,
                        16584624,
                        9534.00,
                        "244555527",
                        681.00,
                        employerList,
                        817.00);

        return recentEmployerResponse;
    }
}

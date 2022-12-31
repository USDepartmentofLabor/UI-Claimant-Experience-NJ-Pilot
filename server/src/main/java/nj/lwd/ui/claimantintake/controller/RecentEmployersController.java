package nj.lwd.ui.claimantintake.controller;

import com.nimbusds.jose.shaded.json.JSONObject;
import java.util.ArrayList;
import java.util.Map;
import nj.lwd.ui.claimantintake.dto.RecentEmployers;
import nj.lwd.ui.claimantintake.service.ClaimStorageService;
import nj.lwd.ui.claimantintake.service.RecentEmployersService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping()
    public ArrayList<Map<String, Object>> getRecentEmployers() {
        // get ssn from claim in S3 using claimant id
        // TODO-change this to get from s3!
        String ssn = "123";
        // claimDate == Sunday prior to now
        // format yyyy-mm-dd
        // TODO-change this to get claimDate to be sunday prior to now
        String claimDate = "2022-12-02";

        // hit WGPM api ({ssn: ssnNumber, claimDate } and get back employer data
        JSONObject recentEmployersResponse =
                recentEmployersService.getRecentEmployerValues(ssn, claimDate);

        RecentEmployers recentEmployers = new RecentEmployers(recentEmployersResponse);

        return recentEmployers.toMapping();
    }
}

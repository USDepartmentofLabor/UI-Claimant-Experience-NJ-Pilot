package nj.lwd.ui.claimantintake.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/recent-employers")
public class RecentEmployersController {

    //    @GetMapping()
    //    public ResponseEntity<String> getRecentEmployers() {
    // get ssn from claim in S3 using claimant id
    // claimDate == Sunday prior to now
    // hit WGPM api ({ssn: ssnNumber, claimDate } and get back employer data
    //        Optional<Map<String, Object>> employersData = {
    //            "recent_employers": [
    //            {
    //                "employer_name": ,
    //                "alternate_employer_name": ,
    //                "employer_address":{
    //                    "address": ,
    //                    "city": ,
    //                    "state": ,
    //                    "zipcode": ,
    //                },
    //                "employer_phone": ,
    //                "fein": ,
    //            },
    //            {
    //                "employer_name": ,
    //                "alternate_employer_name": ,
    //                "employer_address":{
    //                "address": ,
    //                "city": ,
    //                "state": ,
    //                "zipcode": ,
    //            },
    //                "employer_phone": ,
    //                "fein": ,
    //            },
    //            {
    //                "employer_name": ,
    //                "alternate_employer_name": ,
    //                "employer_address":{
    //                "address": ,
    //                "city": ,
    //                "state": ,
    //                "zipcode": ,
    //            },
    //                "employer_phone": ,
    //                "fein": ,
    //            }
    //        ],
    //    }
    //        return ResponseEntity.ok().body(employersData.orElse(new HashMap<>()));
    //    }
}

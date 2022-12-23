// package nj.lwd.ui.claimantintake.controller;
//
//
// import nj.lwd.ui.claimantintake.dto.RecentEmployers;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;
//
// import java.util.HashMap;
// import java.util.Map;
// import java.util.Optional;
// import org.springframework.http.ResponseEntity;
//
// @RestController
// @RequestMapping("/recent-employers")
// public class RecentEmployersController {
//
//        @GetMapping()
//    public ResponseEntity<String> getRecentEmployers() {
//        // get ssn from claim in S3 using claimant id
//        // claimDate == Sunday prior to now
//        // hit WGPM api ({ssn: ssnNumber, claimDate } and get back employer data
//
//        RecentEmployers recentEmployers = new RecentEmployers(); // add parameters
//        Optional<Map<String, Object>> employersData = recentEmployers.toMapping();
////
////        return ResponseEntity.ok().body(employersData.orElse(new HashMap<>()));
////    }
////    private JSONArray convertJSONDataToEmployerList(JSONObject wgpmData) {
////        JSONArray employers = wgpmData.get("wagePotentialMonLookupResponseEmployerDtos");
////        JSONArray employerList = new JSONArray();
////        for (Object e : employers) {
////           Object employerObject = Map<>(
////                   employerAddressLine5.put(e.employerAddressLine5)
////                    "employerAddressLine4": "PEABODY MA",
////                    "employerAddressLine3": "P O BOX 6001",
////                    "employerAddressLine2": "C/O TALX UC EXPRESS",
////                    "employerFein": "031143718000000",
////                    "employerAddressLine1": "DIRECT FUTURE MAIL",
////                    "employerAddressZip": "01961",
////                    "employerName": "VICTORIA'S SECRET STORES, INC.",
////            )
////            employerList.add(employerObject);
////           }
////
////        }
////        return employerList;
////    }
// }

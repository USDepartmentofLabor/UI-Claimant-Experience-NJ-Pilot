package nj.lwd.ui.claimantintake.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.shaded.json.JSONObject;
import nj.lwd.ui.claimantintake.constants.RecentEmployerResponseKeys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class RecentEmployersService {
    private final Logger logger = LoggerFactory.getLogger(RecentEmployersService.class);

    public JSONObject getRecentEmployerValues(String ssn, String claimDate) {

        // TODO - delete everything below and send the wgpm api call
        // parameters for call are ssn and claimdate
        // get claim date here instead of in controller?

        String employersString =
                """
        {
            "responseStatus":"0",
            "indeterminateInd":false,
            "invalidMonetaryInd":false,
            "claimDateEcho":1658462400000,
            "grossMaxBenefitAllowance":9534.00,
            "ssnEcho":"244555527",
            "weeklyBenefitRate":681.00,
            "wagePotentialMonLookupResponseEmployerDtos":[
               {

                  "employerAddressLine5":null,
                  "employerAddressLine4":"PEABODY MA",
                  "employerAddressLine3":"P O BOX 6001",
                  "employerAddressLine2":"C/O TALX UC EXPRESS",
                  "employerFein":"031143718000000",
                  "employerAddressLine1":"DIRECT FUTURE MAIL",
                  "employerAddressZip":"01961",
                  "employerName":"VICTORIAS SECRET STORES, INC.",
                  "employerStatePayrollNumber":null,
                  "employerTelephoneNumber":"6144151035",
                  "employerSequenceNumber":"001"
               },
               {

                  "employerAddressLine5":null,
                  "employerAddressLine4":"WASHINGTON DC",
                  "employerAddressLine3":"SUITE #2",
                  "employerAddressLine2":"2212 superhero street",
                  "employerFein":"031143718000000",
                  "employerAddressLine1":"The Hall of Justice",
                  "employerAddressZip":"01961",
                  "employerName":"Justice League",
                  "employerStatePayrollNumber":null,
                  "employerTelephoneNumber":"6144151035",
                  "employerSequenceNumber":"001"
               },
               {

                  "employerAddressLine5":null,
                  "employerAddressLine4":"Metropolis KS",
                  "employerAddressLine3":null,
                  "employerAddressLine2":"#7",
                  "employerFein":"031143718000000",
                  "employerAddressLine1":"123 Secret Identity Street",
                  "employerAddressZip":"12345",
                  "employerName":"Daily Planet",
                  "employerStatePayrollNumber":null,
                  "employerTelephoneNumber":"6144151035",
                  "employerSequenceNumber":"001"
               }
            ],
            "potentialPartialWeeklyBenefitRate":817.00
         } """;

        try {
            JSONObject employersJsonObject =
                    new ObjectMapper().readValue(employersString, JSONObject.class);
            return employersJsonObject;
        } catch (JsonProcessingException e) {
            // Ignore the bad catch as we are removing this function with a subsequent story
            logger.error("Couldn't parse test string" + e.getMessage());
        }

        JSONObject errorReturn = new JSONObject();
        errorReturn.appendField(RecentEmployerResponseKeys.RESPONSE_STATUS.value, 3);
        return errorReturn;
    }
}

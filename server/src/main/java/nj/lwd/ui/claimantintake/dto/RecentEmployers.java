package nj.lwd.ui.claimantintake.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.nimbusds.jose.shaded.json.JSONObject;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;
import nj.lwd.ui.claimantintake.constants.RecentEmployerResponseKeys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RecentEmployers {
    private ArrayList<Employer> recentEmployers;
    private final Logger logger = LoggerFactory.getLogger(RecentEmployers.class);

    public RecentEmployers(JSONObject recentEmployersResponse) {
        try {
            this.recentEmployers = new ArrayList<Employer>();
            parseRecentEmployers(recentEmployersResponse);

        } catch (JsonProcessingException e) {
            logger.error("Couldn't parse the employer response.");
            logger.error(e.getMessage());
        }
    }

    private void parseRecentEmployers(JSONObject recentEmployersResponse)
            throws JsonMappingException, JsonProcessingException {
        // TODO - should i just change this to a setRecentEmployer function?
        // documentation says that if status code is 0 than a record is found for the ssn, otherwise
        // no data is return for recent employer

        if (recentEmployersResponse == null
                || !recentEmployersResponse
                        .get(RecentEmployerResponseKeys.RESPONSE_STATUS.value)
                        .equals("0")) {
            recentEmployers = new ArrayList<>();
        } else {
            ArrayList<LinkedHashMap> employerListArray =
                    (ArrayList<LinkedHashMap>)
                            recentEmployersResponse.get(
                                    RecentEmployerResponseKeys.EMPLOYER_LIST.value);

            for (LinkedHashMap employer : employerListArray) {
                String employerName =
                        (String) employer.get(RecentEmployerResponseKeys.EMPLOYER_NAME.value);
                // TODO- hich field is for alt name
                String alternate_employer_name = "TODO_FILL THIS IN";
                // TODO- is it better to have this logic in the address object? and just pass map
                // also see if there is a way to shorten the enum accessing
                // + try to avoid having to cast to string here?
                String addr1 =
                        (String) employer.get(RecentEmployerResponseKeys.ADDRESS_LINE_1.value);
                String addr2 =
                        (String) employer.get(RecentEmployerResponseKeys.ADDRESS_LINE_2.value);
                String addr3 =
                        (String) employer.get(RecentEmployerResponseKeys.ADDRESS_LINE_3.value);
                String addr4 =
                        (String) employer.get(RecentEmployerResponseKeys.ADDRESS_LINE_4.value);
                String zipcode = (String) employer.get(RecentEmployerResponseKeys.ZIPCODE.value);
                String fein = (String) employer.get(RecentEmployerResponseKeys.FEIN.value);
                String employerPhone =
                        (String) employer.get(RecentEmployerResponseKeys.PHONE_NUMBER.value);
                recentEmployers.add(
                        new Employer(
                                employerName,
                                addr1,
                                addr2,
                                addr3,
                                addr4,
                                zipcode,
                                fein,
                                employerPhone));
            }
        }
    }

    public ArrayList<Map<String, Object>> toMapping() {
        ArrayList<Map<String, Object>> recentEmployerMap = new ArrayList<>();
        if (recentEmployers.size() < 1) {
            return new ArrayList<Map<String, Object>>();
        }
        for (Employer employer : recentEmployers) {
            recentEmployerMap.add(employer.toMapping());
        }
        return recentEmployerMap;
    }
}

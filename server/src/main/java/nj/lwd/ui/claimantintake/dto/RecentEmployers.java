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
    // private final Logger logger = LoggerFactory.getLogger(RecentEmployers.class);

    public RecentEmployers() {
        recentEmployers = new ArrayList<Employer>();
    }

    public RecentEmployers(JSONObject recentEmployersResponse) {
        this();
        try {
            setRecentEmployers(recentEmployersResponse);

        } catch (JsonProcessingException e) {
            Logger logger = LoggerFactory.getLogger(RecentEmployers.class);
            logger.error("Couldn't parse the employer response.");
            logger.error(e.getMessage());
        }
    }

    private void setRecentEmployers(JSONObject recentEmployersResponse)
            throws JsonMappingException, JsonProcessingException {

        // per documentation,  if status code is not 0 then no recent employer data is returned
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

    public ArrayList<Employer> getRecentEmployers() {
        ArrayList<Employer> recEmployerCopy = new ArrayList<Employer>();
        for (int i = 0; i < recentEmployers.size(); i++) {
            recEmployerCopy.add(recentEmployers.get(i));
        }
        return recEmployerCopy;
    }
}

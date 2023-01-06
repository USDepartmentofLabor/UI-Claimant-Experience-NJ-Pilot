package nj.lwd.ui.claimantintake.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import java.util.ArrayList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RecentEmployers {
    private ArrayList<Employer> recentEmployers;
    // private final Logger logger = LoggerFactory.getLogger(RecentEmployers.class);

    public RecentEmployers() {
        recentEmployers = new ArrayList<Employer>();
    }

    public RecentEmployers(RecentEmployersResponse recentEmployersResponse) {
        this();
        try {
            setRecentEmployers(recentEmployersResponse);

        } catch (JsonProcessingException e) {
            // TODO - remove no longer processing json
            Logger logger = LoggerFactory.getLogger(RecentEmployers.class);
            logger.error("Couldn't parse the employer response.");
            logger.error(e.getMessage());
        }
    }

    private void setRecentEmployers(RecentEmployersResponse recentEmployersResponse)
            throws JsonMappingException, JsonProcessingException {

        // per documentation,  if status code is not 0 then no recent employer data is returned
        if (recentEmployersResponse == null
                || !recentEmployersResponse.getResponseStatus().equals("0")) {
            recentEmployers = new ArrayList<>();
        } else {
            ArrayList<WagePotentialResponseEmployer> employerListArray =
                    recentEmployersResponse.getWagePotentialMonLookupResponseEmployerDtos();

            for (WagePotentialResponseEmployer employer : employerListArray) {
                String employerName = employer.getEmployerName();

                String addr1 = employer.getEmployerAddressLine1();
                String addr2 = employer.getEmployerAddressLine2();
                String addr3 = employer.getEmployerAddressLine3();
                String addr4 = employer.getEmployerAddressLine4();
                String zipcode = employer.getEmployerAddressZip();
                String fein = employer.getEmployerFein();
                String employerPhone = employer.getEmployerTelephoneNumber();
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

    public ArrayList<Employer> getRecentEmployers() {
        ArrayList<Employer> recEmployerCopy = new ArrayList<Employer>();
        for (int i = 0; i < recentEmployers.size(); i++) {
            recEmployerCopy.add(recentEmployers.get(i));
        }
        return recEmployerCopy;
    }
}

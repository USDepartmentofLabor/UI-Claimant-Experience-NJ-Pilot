package nj.lwd.ui.claimantintake.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class CustomValidationService {
    private final int MAX_MAILING_ADDRESS_LEN = 44;
    private final String SSN_FOURTH_FIFTH_CHARS = "00";
    private final String SSN_SIXTH_NINETH_CHARS = "0000";
    private final String MAILING_ADDRESS_ERROR =
            String.format(
                    "Mailing address error: street and city fields exceed the %d character maximum",
                    MAX_MAILING_ADDRESS_LEN);
    private final String MAILING_ADDRESS_INVALID_FORMAT =
            "Mailing address error: unable to read the provided format";

    private final String RECALL_DATE_ERROR =
            "Definite date of recall error on employer %s: date of recall cannot be before"
                    + " employment last date";
    private final String SSN_FOURTH_FIFTH__ERROR =
            "SSN error: the 4th and 5th characters cannot equal " + SSN_FOURTH_FIFTH_CHARS;
    private final String SSN_SIXTH_SEVENTH_ERROR =
            "SSN error: the 6th and 9th characters cannot equal " + SSN_SIXTH_NINETH_CHARS;
    private final String LAST_DATE_ERROR =
            "Employment last date error on employer %s: last date cannot be before employment start"
                    + " date";

    private final String UNNAMED_EMPLOYER = "Unnamed employer";
    private final Logger logger = LoggerFactory.getLogger(CustomValidationService.class);

    public List<String> performCustomValidations(Map<String, Object> claimData) {

        ArrayList<String> validationErrors = new ArrayList<>();

        validateMailingAddress(validationErrors, claimData.get("mailing_address"));
        validateSSN(validationErrors, (String) claimData.get("ssn"));
        validateEmployers(validationErrors, claimData.get("employers"));

        return new ArrayList<>(validationErrors);
    }

    private boolean dateIsAfter(String earlierDateString, String laterDateString) {
        if (earlierDateString == null || laterDateString == null) {
            // do not throw an error for missing field
            return true;
        }

        LocalDate earlierDate = LocalDate.parse(earlierDateString);
        LocalDate laterDate = LocalDate.parse(laterDateString);
        return laterDate.isAfter(earlierDate);
    }

    private void validateEmployers(ArrayList<String> validationErrors, Object employers) {
        if (employers instanceof List) {
            List<Map<String, Object>> employerList = new ArrayList((List<?>) employers);
            for (Object employer : employerList) {

                ObjectMapper objectMapper = new ObjectMapper();
                Map<String, Object> claimMap = new HashMap<>();

                claimMap = objectMapper.convertValue(employer, claimMap.getClass());

                String employerName = (String) claimMap.get("employer_name");
                if (employerName == null) {
                    employerName = UNNAMED_EMPLOYER;
                }

                validateRecallDateAfterLastDate(
                        validationErrors,
                        (String) claimMap.get("definite_recall_date"),
                        (String) claimMap.get("employment_last_date"),
                        employerName);

                validateLastDateAfterStartDate(
                        validationErrors,
                        (String) claimMap.get("employment_start_date"),
                        (String) claimMap.get("employment_last_date"),
                        employerName);
            }
        }
    }

    private void validateMailingAddress(
            ArrayList<String> validationErrors, Object mailingAddressObj) {
        int addressLen = 0;
        int cityLen = 0;
        if (mailingAddressObj != null) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                Map<String, Object> addressfields = new HashMap<>();
                addressfields =
                        objectMapper.convertValue(mailingAddressObj, addressfields.getClass());

                String address = (String) addressfields.get("address");
                String city = (String) addressfields.get("city");

                if (address != null) {
                    addressLen = address.length();
                }

                if (city != null) {
                    cityLen = city.length();
                }

                if (addressLen + cityLen > MAX_MAILING_ADDRESS_LEN) {
                    validationErrors.add(MAILING_ADDRESS_ERROR);
                }
            } catch (IllegalArgumentException e) {
                logger.error(
                        "Mailing address was unable to be converted to a map but was not null.");
                validationErrors.add(MAILING_ADDRESS_INVALID_FORMAT);
            }
        }
    }

    private void validateSSN(ArrayList<String> validationErrors, String ssn) {
        if (!(ssn == null || ssn.length() != 9)) {
            String fourthFifthChars = ssn.substring(3, 5);
            String sixthSeventhChars = ssn.substring(5, 9);

            if (fourthFifthChars.equals(SSN_FOURTH_FIFTH_CHARS)) {
                validationErrors.add(SSN_FOURTH_FIFTH__ERROR);
            }

            if (sixthSeventhChars.equals(SSN_SIXTH_NINETH_CHARS)) {
                validationErrors.add(SSN_SIXTH_SEVENTH_ERROR);
            }
        }
    }

    private void validateRecallDateAfterLastDate(
            ArrayList<String> validationErrors,
            String definiteRecallDateString,
            String employmentLastDateString,
            String employerName) {

        if (!dateIsAfter(employmentLastDateString, definiteRecallDateString)) {
            validationErrors.add(String.format(RECALL_DATE_ERROR, employerName));
        }
    }

    private void validateLastDateAfterStartDate(
            ArrayList<String> validationErrors,
            String employmentStartDateString,
            String employmentLastDateString,
            String employerName) {
        if (!dateIsAfter(employmentStartDateString, employmentLastDateString)) {
            validationErrors.add(String.format(LAST_DATE_ERROR, employerName));
        }
    }
}

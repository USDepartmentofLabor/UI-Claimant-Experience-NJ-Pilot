package nj.lwd.ui.claimantintake.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CustomValidationService {

    private final int MAX_MAILING_ADDRESS_LEN = 44;
    private final String SSN_FOURTH_FIFTH_CHARS = "00";
    private final String SSN_SIXTH_NINETH_CHARS = "0000";
    private final String MAILING_ADDRESS_ERROR =
            String.format(
                    "Mailing address error: street and city fields exceed the %d character maximum",
                    MAX_MAILING_ADDRESS_LEN);
    private final String SSN_FOURTH_FIFTH__ERROR =
            String.format(
                    "SSN error: the 4th and 5th characters cannot equal %s",
                    SSN_FOURTH_FIFTH_CHARS);
    private final String SSN_SIXTH_SEVENTH_ERROR =
            String.format(
                    "SSN error: the 6th and 9th characters cannot equal %s",
                    SSN_SIXTH_NINETH_CHARS);
    private final String LAST_DATE_ERROR =
            "Employment last date error: last date cannot be before employment start date";
    private final String RECALL_DATE_ERROR =
            "Definite date of recall error: date of recall cannot be before employment last date";
    private final Logger logger = LoggerFactory.getLogger(CustomValidationService.class);

    CustomValidationService() {}

    public ArrayList<String> performCustomValidations(Map<String, Object> claimData) {

        ArrayList<String> validationErrors = new ArrayList<>();

        validateMailingAddress(validationErrors, claimData.get("mailing_address"));
        validateSSN(validationErrors, (String) claimData.get("ssn"));
        validateLastDateAfterStartDate(
                validationErrors,
                (String) claimData.get("employment_start_date"),
                (String) claimData.get("employment_last_date"));
        validateRecallDateAfterLastDate(
                validationErrors,
                (String) claimData.get("definite_recall_date"),
                (String) claimData.get("employment_last_date"));
        return validationErrors;
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

    private void validateMailingAddress(
            ArrayList<String> validationErrors, Object mailingAddressObj) {
        int addressLen = 0;
        int cityLen = 0;
        if (mailingAddressObj != null) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                Map<String, Object> addressfields = new HashMap<String, Object>();
                addressfields =
                        (Map<String, Object>)
                                objectMapper.convertValue(
                                        mailingAddressObj, addressfields.getClass());
                System.out.println(addressfields.toString());
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

    // check defindate date of recall is after last date
    private void validateRecallDateAfterLastDate(
            ArrayList<String> validationErrors,
            String definiteRecallDateString,
            String employmentLastDateString) {
        if (!dateIsAfter(employmentLastDateString, definiteRecallDateString)) {
            validationErrors.add(RECALL_DATE_ERROR);
        }
    }

    private void validateLastDateAfterStartDate(
            ArrayList<String> validationErrors,
            String employmentStartDateString,
            String employmentLastDateString) {
        if (!dateIsAfter(employmentStartDateString, employmentLastDateString)) {
            validationErrors.add(LAST_DATE_ERROR);
        }
    }
}

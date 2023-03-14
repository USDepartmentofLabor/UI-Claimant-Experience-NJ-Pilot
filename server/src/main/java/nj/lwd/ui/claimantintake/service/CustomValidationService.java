package nj.lwd.ui.claimantintake.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import nj.lwd.ui.claimantintake.constants.CustomValidationErrors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class CustomValidationService {
    private ArrayList<String> validationErrors;
    private final int MAX_MAILING_ADDRESS_LEN =
            Integer.parseInt(CustomValidationErrors.MAX_MAILING_ADDRESS_LEN.value());

    private final String SSN_FOURTH_FIFTH_CHARS =
            CustomValidationErrors.SSN_FOURTH_FIFTH_CHARS.value();
    private final String SSN_SIXTH_NINETH_CHARS =
            CustomValidationErrors.SSN_SIXTH_NINETH_CHARS.value();

    private final String MAILING_ADDRESS_ERROR =
            CustomValidationErrors.MAILING_ADDRESS_ERROR.value();
    private final String MAILING_ADDRESS_INVALID_FORMAT =
            CustomValidationErrors.MAILING_ADDRESS_INVALID_FORMAT.value();

    private final String RECALL_DATE_ERROR = CustomValidationErrors.RECALL_DATE_ERROR.value();
    private final String SSN_FOURTH_FIFTH__ERROR =
            CustomValidationErrors.SSN_FOURTH_FIFTH__ERROR.value();

    private final String SSN_SIXTH_SEVENTH_ERROR =
            CustomValidationErrors.SSN_SIXTH_SEVENTH_ERROR.value();
    private final String LAST_DATE_ERROR = CustomValidationErrors.LAST_DATE_ERROR.value();

    private final Logger logger = LoggerFactory.getLogger(CustomValidationService.class);

    public List<String> performCustomValidations(Map<String, Object> claimData) {

        validationErrors = new ArrayList<>();

        validateMailingAddress(claimData.get("mailing_address"));
        validateSSN((String) claimData.get("ssn"));
        validateLastDateAfterStartDate(
                (String) claimData.get("employment_start_date"),
                (String) claimData.get("employment_last_date"));
        validateRecallDateAfterLastDate(
                (String) claimData.get("definite_recall_date"),
                (String) claimData.get("employment_last_date"));
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

    private void validateMailingAddress(Object mailingAddressObj) {
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

    private void validateSSN(String ssn) {
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
            String definiteRecallDateString, String employmentLastDateString) {
        if (!dateIsAfter(employmentLastDateString, definiteRecallDateString)) {
            validationErrors.add(RECALL_DATE_ERROR);
        }
    }

    private void validateLastDateAfterStartDate(
            String employmentStartDateString, String employmentLastDateString) {
        if (!dateIsAfter(employmentStartDateString, employmentLastDateString)) {
            validationErrors.add(LAST_DATE_ERROR);
        }
    }
}

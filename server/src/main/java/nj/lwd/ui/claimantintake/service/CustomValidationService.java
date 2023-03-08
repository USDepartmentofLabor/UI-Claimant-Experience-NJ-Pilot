package nj.lwd.ui.claimantintake.service;

import java.util.ArrayList;
import java.util.Map;

public class CustomValidationService {
    private ArrayList<String> validationErrors;

    CustomValidationService() {
        validationErrors = new ArrayList<>();
    }

    public ArrayList<String> performCustomValidations(Map<String, Object> claimData) {
        // make running arraylist

        // check residence address peices-add to list using passing by reference if error

        // check mailing address
        // check ssn
        // check defindate date of recall is after last date
        // check last date is different from start date
        return validationErrors;
    }

    private void validateMailingAddress() {}

    private void validateSSN() {}

    private void validateSSN() {}

    private void validateSSN() {}

    private void validateSSN() {}

    private void addError(String error) {
        if (error != null) {
            validationErrors.add(error);
        }
    }
}

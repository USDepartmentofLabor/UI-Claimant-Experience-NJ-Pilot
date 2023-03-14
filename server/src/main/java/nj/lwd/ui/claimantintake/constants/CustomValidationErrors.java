package nj.lwd.ui.claimantintake.constants;

public enum CustomValidationErrors {
    MAX_MAILING_ADDRESS_LEN("44"),
    SSN_FOURTH_FIFTH_CHARS("00"),
    SSN_SIXTH_NINETH_CHARS("0000"),
    MAILING_ADDRESS_ERROR(
            "Mailing address error: street and city fields exceed the "
                    + MAX_MAILING_ADDRESS_LEN.value()
                    + " character maximum"),
    MAILING_ADDRESS_INVALID_FORMAT("Mailing address error: unable to read the provided format"),
    RECALL_DATE_ERROR(
            "Definite date of recall error on employer %s: date of recall cannot be before"
                    + " employment last date"),
    SSN_FOURTH_FIFTH__ERROR(
            "SSN error: the 4th and 5th characters cannot equal " + SSN_FOURTH_FIFTH_CHARS.value()),
    SSN_SIXTH_SEVENTH_ERROR(
            "SSN error: the 6th and 9th characters cannot equal " + SSN_SIXTH_NINETH_CHARS.value()),
    LAST_DATE_ERROR(
            "Employment last date error on employer %s: last date cannot be before employment start"
                    + " date"),
    UNNAMED_EMPLOYER("Unnamed employer");

    String value;

    public String value() {
        return value;
    }

    CustomValidationErrors(String errorString) {
        value = errorString;
    }
}

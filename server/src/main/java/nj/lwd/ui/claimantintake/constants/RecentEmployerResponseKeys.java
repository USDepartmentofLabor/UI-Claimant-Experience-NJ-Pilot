package nj.lwd.ui.claimantintake.constants;

public enum RecentEmployerResponseKeys {
    RESPONSE_STATUS("responseStatus"),
    EMPLOYER_LIST("wagePotentialMonLookupResponseEmployerDtos"),
    EMPLOYER_NAME("employerName"),
    ADDRESS_LINE_1("employerAddressLine1"),
    ADDRESS_LINE_2("employerAddressLine2"),
    ADDRESS_LINE_3("employerAddressLine3"),
    ADDRESS_LINE_4("employerAddressLine4"),
    ADDRESS_LINE_5("employerAddressLine5"),
    ZIPCODE("employerAddressZip"),
    PHONE_NUMBER("employerTelephoneNumber"),
    FEIN("employerFein");

    public final String value;

    private RecentEmployerResponseKeys(String value) {
        this.value = value;
    }
}

package nj.lwd.ui.claimantintake.constants;

public enum RecentEmployerClientKeys {
    EMPLOYER_NAME("employer_name"),
    EMPLOYER_ADDRESS("employer_address"),
    ADDRESS("address"),
    CITY("city"),
    STATE("state"),
    ZIPCODE("zipcode"),
    ALT_EMPLOYER_NAME("alternate_employer_name"),
    EMPLOYER_PHONE("employer_phone"),
    FEIN("fein");

    public final String value;

    private RecentEmployerClientKeys(String value) {
        this.value = value;
    }
}

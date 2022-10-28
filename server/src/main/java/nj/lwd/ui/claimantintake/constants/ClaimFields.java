package nj.lwd.ui.claimantintake.constants;

public enum ClaimFields {
    HAS_ALTERNATE_NAMES("LOCAL_claimant_has_alternate_names"),
    HAS_SAME_MAILING_ADDRESS("LOCAL_mailing_address_same"),
    RESIDENCE_ADDRESS("residence_address"),
    MAILING_ADDRESS("mailing_address");

    private String value;

    public String getValue() {
        return value;
    }

    private ClaimFields(String value) {
        this.value = value;
    }
}

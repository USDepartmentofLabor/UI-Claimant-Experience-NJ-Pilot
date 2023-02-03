package nj.lwd.ui.claimantintake.dto;

public class WagePotentialMonLookupRequest {
    private final String ssn;
    private final String claimDate;

    public WagePotentialMonLookupRequest(String ssn, String claimDate) {
        this.ssn = ssn.replace("-", "");
        this.claimDate = claimDate;
    }

    public String getSsn() {
        return ssn;
    }

    public String getClaimDate() {
        return claimDate;
    }
}

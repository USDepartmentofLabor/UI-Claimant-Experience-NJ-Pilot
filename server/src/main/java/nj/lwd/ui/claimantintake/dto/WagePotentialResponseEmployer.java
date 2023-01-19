package nj.lwd.ui.claimantintake.dto;

public class WagePotentialResponseEmployer {
    private final String employerAddressLine5;
    private final String employerAddressLine4;
    private final String employerAddressLine3;
    private final String employerAddressLine2;
    private final String employerAddressLine1;
    private final String employerFein;
    private final String employerAddressZip;
    private final String employerName;
    private final String employerStatePayrollNumber;
    private final String employerTelephoneNumber;
    private final String employerSequenceNumber;

    public WagePotentialResponseEmployer(
            String employerAddressLine5,
            String employerAddressLine4,
            String employerAddressLine3,
            String employerAddressLine2,
            String employerAddressLine1,
            String employerFein,
            String employerAddressZip,
            String employerName,
            String employerStatePayrollNumber,
            String employerTelephoneNumber,
            String employerSequenceNumber) {
        this.employerAddressLine1 = employerAddressLine1;
        this.employerAddressLine2 = employerAddressLine2;
        this.employerAddressLine3 = employerAddressLine3;
        this.employerAddressLine4 = employerAddressLine4;
        this.employerAddressLine5 = employerAddressLine5;
        this.employerFein = employerFein;
        this.employerAddressZip = employerAddressZip;
        this.employerName = employerName;
        this.employerStatePayrollNumber = employerStatePayrollNumber;
        this.employerTelephoneNumber = employerTelephoneNumber;
        this.employerSequenceNumber = employerSequenceNumber;
    }

    public String getEmployerAddressLine5() {
        return employerAddressLine5;
    }

    public String getEmployerAddressLine4() {
        return employerAddressLine4;
    }

    public String getEmployerAddressLine3() {
        return employerAddressLine3;
    }

    public String getEmployerAddressLine2() {
        return employerAddressLine2;
    }

    public String getEmployerAddressLine1() {
        return employerAddressLine1;
    }

    public String getEmployerFein() {
        return employerFein;
    }

    public String getEmployerAddressZip() {
        return employerAddressZip;
    }

    public String getEmployerName() {
        return employerName;
    }

    public String getEmployerStatePayrollNumber() {
        return employerStatePayrollNumber;
    }

    public String getEmployerTelephoneNumber() {
        return employerTelephoneNumber;
    }

    public String getEmployerSequenceNumber() {
        return employerSequenceNumber;
    }
}

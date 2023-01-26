package nj.lwd.ui.claimantintake.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;

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
    private final ArrayList<WagePotentialEmployerWages> wagePotentialMonLookupResponseEmpWageDtos;

    @JsonCreator
    public WagePotentialResponseEmployer(
            @JsonProperty("employerAddressLine5") String employerAddressLine5,
            @JsonProperty("employerAddressLine4") String employerAddressLine4,
            @JsonProperty("employerAddressLine3") String employerAddressLine3,
            @JsonProperty("employerAddressLine2") String employerAddressLine2,
            @JsonProperty("employerAddressLine1") String employerAddressLine1,
            @JsonProperty("employerFein") String employerFein,
            @JsonProperty("employerAddressZip") String employerAddressZip,
            @JsonProperty("employerName") String employerName,
            @JsonProperty("employerStatePayrollNumber") String employerStatePayrollNumber,
            @JsonProperty("employerTelephoneNumber") String employerTelephoneNumber,
            @JsonProperty("employerSequenceNumber") String employerSequenceNumber,
            @JsonProperty("wagePotentialMonLookupResponseEmpWageDtos")
                    ArrayList<WagePotentialEmployerWages>
                            wagePotentialMonLookupResponseEmpWageDtos) {
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
        this.wagePotentialMonLookupResponseEmpWageDtos = wagePotentialMonLookupResponseEmpWageDtos;
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

    public ArrayList<WagePotentialEmployerWages> getWagePotentialMonLookupResponseEmpWageDtos() {
        return wagePotentialMonLookupResponseEmpWageDtos;
    }
}

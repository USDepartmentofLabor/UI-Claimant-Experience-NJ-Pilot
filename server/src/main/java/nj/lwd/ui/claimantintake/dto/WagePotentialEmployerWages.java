package nj.lwd.ui.claimantintake.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class WagePotentialEmployerWages {
    private final String year;
    private final Double quarterWages;
    private final String quarterNumber;
    private final int quarterWeeksWorked;
    private final String nameControl;

    @JsonCreator
    public WagePotentialEmployerWages(
            @JsonProperty("year") String year,
            @JsonProperty("quarterWages") Double quarterWages,
            @JsonProperty("quarterNumber") String quarterNumber,
            @JsonProperty("quarterWeeksWorked") int quarterWeeksWorked,
            @JsonProperty("nameControl") String nameControl) {
        this.year = year;
        this.quarterWages = quarterWages;
        this.quarterNumber = quarterNumber;
        this.quarterWeeksWorked = quarterWeeksWorked;
        this.nameControl = nameControl;
    }

    public String getYear() {
        return year;
    }

    public Double getQuarterWages() {
        return quarterWages;
    }

    public String getQuarterNumber() {
        return quarterNumber;
    }

    public int getQuarterWeeksWorked() {
        return quarterWeeksWorked;
    }

    public String getNameControl() {
        return nameControl;
    }
}

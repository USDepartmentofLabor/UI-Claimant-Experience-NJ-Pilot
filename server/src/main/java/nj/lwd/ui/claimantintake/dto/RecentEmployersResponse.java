package nj.lwd.ui.claimantintake.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;

public class RecentEmployersResponse {
    private final String responseStatus;
    private final boolean indeterminateInd;
    private final boolean invalidMonetaryInd;
    private final long claimDateEcho;
    private final double grossMaxBenefitAllowance;
    private final String ssnEcho;
    private final double weeklyBenefitRate;
    private final ArrayList<WagePotentialResponseEmployer>
            wagePotentialMonLookupResponseEmployerDtos;
    private final double potentialPartialWeeklyBenefitRate;

    @JsonCreator
    public RecentEmployersResponse(
            @JsonProperty("responseStatus") String responseStatus,
            @JsonProperty("indeterminateInd") boolean indeterminateInd,
            @JsonProperty("invalidMonetaryInd") boolean invalidMonetaryInd,
            @JsonProperty("claimDateEcho") long claimDateEcho,
            @JsonProperty("grossMaxBenefitAllowance") double grossMaxBenefitAllowance,
            @JsonProperty("ssnEcho") String ssnEcho,
            @JsonProperty("weeklyBenefitRate") double weeklyBenefitRate,
            @JsonProperty("wagePotentialMonLookupResponseEmployerDtos")
                    ArrayList<WagePotentialResponseEmployer>
                            wagePotentialMonLookupResponseEmployerDtos,
            @JsonProperty("potentialPartialWeeklyBenefitRate")
                    double potentialPartialWeeklyBenefitRate) {

        this.responseStatus = responseStatus;
        this.indeterminateInd = indeterminateInd;
        this.invalidMonetaryInd = invalidMonetaryInd;
        this.claimDateEcho = claimDateEcho;
        this.grossMaxBenefitAllowance = grossMaxBenefitAllowance;
        this.ssnEcho = ssnEcho;
        this.weeklyBenefitRate = weeklyBenefitRate;
        this.wagePotentialMonLookupResponseEmployerDtos =
                copyArrayList(wagePotentialMonLookupResponseEmployerDtos);
        this.potentialPartialWeeklyBenefitRate = potentialPartialWeeklyBenefitRate;
    }

    public ArrayList<WagePotentialResponseEmployer> copyArrayList(
            ArrayList<WagePotentialResponseEmployer> wagePotentialDtosArray) {
        if (wagePotentialDtosArray == null) {
            return null;
        }

        ArrayList<WagePotentialResponseEmployer> copyWagePotentialDtos =
                new ArrayList<>(wagePotentialDtosArray.size());
        for (WagePotentialResponseEmployer wgpmResponseEmployer : wagePotentialDtosArray) {
            copyWagePotentialDtos.add(wgpmResponseEmployer);
        }
        return copyWagePotentialDtos;
    }

    public String getResponseStatus() {
        return responseStatus;
    }

    public boolean getIndeterminateInd() {
        return indeterminateInd;
    }

    public boolean getInvalidMonetaryInd() {
        return invalidMonetaryInd;
    }

    public long getClaimDateEcho() {
        return claimDateEcho;
    }

    public double getGrossMaxBenefitAllowance() {
        return grossMaxBenefitAllowance;
    }

    public String getSsnEcho() {
        return ssnEcho;
    }

    public double getWeeklyBenefitRate() {
        return weeklyBenefitRate;
    }

    public ArrayList<WagePotentialResponseEmployer>
            getWagePotentialMonLookupResponseEmployerDtos() {
        return copyArrayList(wagePotentialMonLookupResponseEmployerDtos);
    }

    public double getPotentialPartialWeeklyBenefitRate() {
        return potentialPartialWeeklyBenefitRate;
    }
}

package nj.lwd.ui.claimantintake.dto;

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

    public RecentEmployersResponse(
            String responseStatus,
            boolean indeterminateInd,
            boolean invalidMonetaryInd,
            long claimDateEcho,
            double grossMaxBenefitAllowance,
            String ssnEcho,
            double weeklyBenefitRate,
            ArrayList<WagePotentialResponseEmployer> wagePotentialMonLookupResponseEmployerDtos,
            double potentialPartialWeeklyBenefitRate) {
        // ArrayList<WagePotentialResponseEmployer> copyWagePotentialDtos=new ArrayList<>();
        // for (int i=0;i< wagePotentialMonLookupResponseEmployerDtos.size(); i++){
        //     copyWagePotentialDtos.add(wagePotentialMonLookupResponseEmployerDtos.get(i));
        // }
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
        ArrayList<WagePotentialResponseEmployer> copyWagePotentialDtos = new ArrayList<>();
        for (int i = 0; i < wagePotentialDtosArray.size(); i++) {
            copyWagePotentialDtos.add(wagePotentialDtosArray.get(i));
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

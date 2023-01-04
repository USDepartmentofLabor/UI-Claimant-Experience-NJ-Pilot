package nj.lwd.ui.claimantintake.dto;

import java.util.HashMap;
import java.util.Map;
import nj.lwd.ui.claimantintake.constants.RecentEmployerClientKeys;

public class Employer {
    private final String employer_name;
    private final String alternate_employer_name;
    private final Address employer_address;
    private final HashMap<String, String> employer_phone;
    private final String fein;

    public Employer(
            String employerName,
            String addressLine1,
            String addressLine2,
            String addressLine3,
            String addressLine4,
            String zipcode,
            String fein,
            String employerPhone) {
        this.employer_name = employerName;
        // this.alternate_employer_name=; which field?? TODO-add alt name
        this.alternate_employer_name = "TODO_FILL THIS IN";
        this.employer_address =
                new Address(addressLine1, addressLine2, addressLine3, addressLine4, zipcode);

        // TODO -  should we send fein back before we have the client expecting fein for an
        // employer?
        //          fein is not part of the employer object yet
        this.fein = fein;
        this.employer_phone =
                new HashMap<String, String>() {
                    {
                        put("number", employerPhone);
                    }
                };
    }

    public Map<String, Object> toMapping() {
        return new HashMap<String, Object>() {
            {
                put(RecentEmployerClientKeys.EMPLOYER_ADDRESS.value, employer_address.toMapping());
                put(RecentEmployerClientKeys.EMPLOYER_NAME.value, employer_name);
                put(RecentEmployerClientKeys.ALT_EMPLOYER_NAME.value, alternate_employer_name);
                put(RecentEmployerClientKeys.EMPLOYER_PHONE.value, employer_phone);
                put(RecentEmployerClientKeys.FEIN.value, fein);
            }
        };
    }
}

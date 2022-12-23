package nj.lwd.ui.claimantintake.dto;

import java.util.HashMap;

public class Employer {
    private final String employer_name;
    private final String alternate_employer_name;
    private final Address employer_address;
    private final HashMap<String, String> employer_phone;
    private final String fein;

    public Employer(
            String employer_name,
            String alternate_employer_name,
            Address employer_address,
            String phone_number,
            String fein) {
        this.employer_name = employer_name;
        this.alternate_employer_name = alternate_employer_name;
        this.employer_phone =
                new HashMap<String, String>() {
                    {
                        put("number", phone_number);
                    }
                };
        this.employer_address = employer_address;
        this.fein = fein;
    }
}

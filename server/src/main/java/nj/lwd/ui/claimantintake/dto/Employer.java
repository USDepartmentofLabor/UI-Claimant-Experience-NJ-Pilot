package nj.lwd.ui.claimantintake.dto;

import java.util.HashMap;

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
        this.alternate_employer_name = "business llc";
        this.employer_address =
                new Address(addressLine1, addressLine2, addressLine3, addressLine4, zipcode);
        this.fein = fein;
        this.employer_phone =
                new HashMap<String, String>() {
                    {
                        put("number", employerPhone);
                    }
                };
    }

    // for spring to map the dto it has to be get+name of varaible in camel case
    // the _ in our variables make the get ugly,
    // but changing it leads to spring unable to parse the employer into JSON
    public String getEmployer_name() {
        return employer_name;
    }

    public String getAlternate_employer_name() {
        return alternate_employer_name;
    }

    public Address getEmployer_address() {
        return employer_address;
    }

    public HashMap<String, String> getEmployer_phone() {
        HashMap<String, String> employerPhone = new HashMap<String, String>();
        employerPhone.putAll(employer_phone);
        return employerPhone;
    }

    public String getFein() {
        return fein;
    }
}

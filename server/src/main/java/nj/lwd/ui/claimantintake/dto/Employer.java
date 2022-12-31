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

    // public Employer(
    //         String employer_name,
    //         String alternate_employer_name,
    //         Address employer_address,
    //         String phone_number,
    //         String fein) {
    //     this.employer_name = employer_name;
    //     this.alternate_employer_name = alternate_employer_name;
    //     this.employer_phone =
    //             new HashMap<String, String>() {
    //                 {
    //                     put("number", phone_number);
    //                 }
    //             };
    //     this.employer_address = employer_address;
    //     this.fein = fein;
    // }
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
        // TODO- is it better to have this logic in the address object? and just pass map
        // also see if there is a way to shorten the enum accessing
        // + try to avoid having to cast to string here?
        this.employer_address =
                new Address(addressLine1, addressLine2, addressLine3, addressLine4, zipcode);
        // TODO - send fein back before we have client expecting fein for an employer?
        this.fein = fein;
        // his.employer_name =
        //         (String) employerResponseMap.get(RecentEmployerResponseKeys.EMPLOYER_NAME.value);
        // // this.alternate_employer_name=; which field?? TODO-add alt name
        // this.alternate_employer_name = "TODO_FILL THIS IN";
        // // TODO- is it better to have this logic in the address object? and just pass map
        // // also see if there is a way to shorten the enum accessing
        // // + try to avoid having to cast to string here?
        // String addr1 =
        //         (String)
        // employerResponseMap.get(RecentEmployerResponseKeys.ADDRESS_LINE_1.value);
        // String addr2 =
        //         (String)
        // employerResponseMap.get(RecentEmployerResponseKeys.ADDRESS_LINE_2.value);
        // String addr3 =
        //         (String)
        // employerResponseMap.get(RecentEmployerResponseKeys.ADDRESS_LINE_3.value);
        // String addr4 =
        //         (String)
        // employerResponseMap.get(RecentEmployerResponseKeys.ADDRESS_LINE_4.value);
        // String zipcode = (String)
        // employerResponseMap.get(RecentEmployerResponseKeys.ZIPCODE.value);
        // this.employer_address = new Address(addr1, addr2, addr3, addr4, zipcode);
        // // TODO - send fein back before we have client expecting fein for an employer?
        // this.fein = (String) employerResponseMap.get(RecentEmployerResponseKeys.FEIN.value);
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
                put(RecentEmployerClientKeys.employer_address.name(), employer_address.toMapping());
                put(RecentEmployerClientKeys.employer_name.name(), employer_name);
                put(
                        RecentEmployerClientKeys.alternate_employer_name.name(),
                        alternate_employer_name);
                put(RecentEmployerClientKeys.employer_phone.name(), employer_phone);
                put(RecentEmployerClientKeys.fein.name(), fein);
            }
        };
    }
}

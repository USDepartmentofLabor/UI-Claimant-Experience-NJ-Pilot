package nj.lwd.ui.claimantintake.dto;

import java.util.HashMap;
import java.util.Map;
import nj.lwd.ui.claimantintake.constants.RecentEmployerClientKeys;

public class Address {
    private final String address;
    private final String city;
    private final String state;
    private final String zipcode;

    public Address(
            String addressLine1,
            String addressLine2,
            String addressLine3,
            String address4,
            String zipcode) {
        // address is line 1, 2 and 3
        this.address = addressLine1 + "\n" + addressLine2 + "\n" + addressLine3;
        String[] cityState = address4.split(" ");
        this.city = cityState[0];
        this.state = cityState[1];
        this.zipcode = zipcode;
    }

    public String getAddress() {
        return address;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getZipcode() {
        return zipcode;
    }

    public Map<String, Object> toMapping() {

        return new HashMap<String, Object>() {
            {
                put(RecentEmployerClientKeys.address.name(), address);
                put(RecentEmployerClientKeys.city.name(), city);
                put(RecentEmployerClientKeys.state.name(), state);
                put(RecentEmployerClientKeys.zipcode.name(), zipcode);
            }
        };
    }
}

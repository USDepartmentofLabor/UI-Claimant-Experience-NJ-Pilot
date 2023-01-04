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

        this.address = createAddress(addressLine1, addressLine2, addressLine3);
        String[] cityState = address4.split(" ");
        this.city = cityState[0];
        this.state = cityState[1];
        this.zipcode = zipcode;
    }

    public String createAddress(String addressLine1, String addressLine2, String addressLine3) {
        String temp = "";
        if (addressLine1 != null) {

            temp += addressLine1;
        }
        if (addressLine2 != null) {
            if (!temp.equals("")) {
                temp += "\n";
            }
            temp += addressLine2;
        }
        if (addressLine3 != null) {
            if (!temp.equals("")) {
                temp += "\n";
            }
            temp += addressLine3;
        }
        return temp;
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
                put(RecentEmployerClientKeys.ADDRESS.value, address);
                put(RecentEmployerClientKeys.CITY.value, city);
                put(RecentEmployerClientKeys.STATE.value, state);
                put(RecentEmployerClientKeys.ZIPCODE.value, zipcode);
            }
        };
    }
}

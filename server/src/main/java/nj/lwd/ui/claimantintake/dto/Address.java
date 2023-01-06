package nj.lwd.ui.claimantintake.dto;

public class Address {
    private final String address;
    private final String address2;
    private final String address3;
    private final String city;
    private final String state;
    private final String zipcode;

    public Address(
            String addressLine1,
            String addressLine2,
            String addressLine3,
            String address4,
            String zipcode) {

        // TODO - address may need to be changed when translation is determined and implemented
        // one of these address fields MAY be alt name,
        // addressline 5 may need to be used as well.
        this.address = addressLine1;
        this.address2 = addressLine2;
        this.address3 = addressLine3;

        // TODO - when doing the translation this should be changed to handle
        // cities with a space as well
        String[] cityState = address4.split(" ");
        this.city = cityState[0];
        this.state = cityState[1];
        this.zipcode = zipcode;
    }

    public String getAddress() {
        return address;
    }

    public String getAddress2() {
        return address2;
    }

    public String getAddress3() {
        return address3;
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
}

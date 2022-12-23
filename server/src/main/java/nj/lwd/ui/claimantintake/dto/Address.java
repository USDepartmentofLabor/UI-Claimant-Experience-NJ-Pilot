package nj.lwd.ui.claimantintake.dto;

public class Address {
    private final String address;
    private final String city;
    private final String state;
    private final String zipcode;

    public Address(String address, String city, String state, String zipcode) {
        this.address = address;
        this.city = city;
        this.state = state;
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
}

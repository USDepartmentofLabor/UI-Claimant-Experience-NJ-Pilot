package nj.lwd.ui.claimantintake.models;

public class WhoAmI {
    private final String firstName;
    private final String middleInitial;
    private final String lastName;
    private final String email;

    private final String phone;
    private final String ssn;
    private final String birthdate;

    public WhoAmI(
            String firstName,
            String middleInitial,
            String lastName,
            String email,
            String phone,
            String ssn,
            String birthdate) {
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.ssn = ssn;
        this.birthdate = birthdate;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getMiddleInitial() {
        return middleInitial;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getSsn() {
        return ssn;
    }

    public String getBirthdate() {
        return birthdate;
    }
}

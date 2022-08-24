package nj.lwd.ui.claimantintake.models;

public class WhoAmI {
    private final String firstName;
    private final String lastName;
    private final String email;

    public WhoAmI(String firstName, String lastName, String email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public String toString() {
        return "{\"firstName\":\""
                + getFirstName()
                + "\","
                + "\"lastName\":\""
                + getLastName()
                + "\","
                + "\"email:\""
                + getEmail()
                + "\"}";
    }
}

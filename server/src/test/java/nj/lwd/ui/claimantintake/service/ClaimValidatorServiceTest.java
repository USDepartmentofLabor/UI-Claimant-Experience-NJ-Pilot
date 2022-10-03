package nj.lwd.ui.claimantintake.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.networknt.schema.ValidationMessage;
import java.util.Objects;
import java.util.Set;
import org.junit.jupiter.api.Test;

public class ClaimValidatorServiceTest {
    final String testSchemaName = "test/claim-validation-testV1";

    @Test
    void claimIsValid() throws Exception {
        String validClaim =
                """
                          {
                          "claimant_name": {
                            "first_name": "Joan",
                            "last_name": "Jett"
                          }
                        }
                        """;
        ClaimValidatorService claimValidator =
                new ClaimValidatorService("classpath:", testSchemaName);

        Set<ValidationMessage> errorMessages = claimValidator.validateAgainstSchema(validClaim);
        assert (errorMessages.size() < 1);
    }

    @Test
    void claimIsNotValid() throws Exception {
        String invalidClaim =
                """
                          {
                          "claimant_name": {
                            "last_name": 5
                          }
                        }
                        """;
        ClaimValidatorService claimValidator =
                new ClaimValidatorService("classpath:", testSchemaName);

        Set<ValidationMessage> errorMessages = claimValidator.validateAgainstSchema(invalidClaim);
        assert (errorMessages.size() == 2);

        errorMessages.forEach(
                (m) -> {
                    if (Objects.equals(m.getType(), "required")) {
                        assertEquals(
                                "$.claimant_name.first_name: is missing but it is required",
                                m.getMessage());

                    } else {
                        assertEquals(
                                "$.claimant_name.last_name: integer found, string expected",
                                m.getMessage());
                    }
                });
    }
}
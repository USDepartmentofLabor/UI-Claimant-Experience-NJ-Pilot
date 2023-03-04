package nj.lwd.ui.claimantintake.service;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;

import com.networknt.schema.JsonSchemaFactory;
import com.networknt.schema.SpecVersion;
import java.util.ArrayList;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;

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

        ArrayList<String> errorMessages = claimValidator.validateAgainstSchema(validClaim);
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

        ArrayList<String> errorMessages = claimValidator.validateAgainstSchema(invalidClaim);
        assert (errorMessages.size() == 2);
        assertTrue(
                errorMessages.contains(
                        "$.claimant_name.first_name: is missing but it is required"));
        assertTrue(
                errorMessages.contains(
                        "$.claimant_name.last_name: integer found, string expected"));
    }

    @Test
    void schemaIs2019Dialect() throws Exception {

        try (MockedStatic<JsonSchemaFactory> factory = mockStatic(JsonSchemaFactory.class)) {
            factory.when(() -> JsonSchemaFactory.getInstance(any()))
                    .thenReturn(mock(JsonSchemaFactory.class));

            ClaimValidatorService claimValidator =
                    new ClaimValidatorService("classpath:", testSchemaName);
            // Print this to prevent spotbugs from being stupid
            System.out.println(claimValidator);
            factory.verify(() -> JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V201909));
        }
    }
}

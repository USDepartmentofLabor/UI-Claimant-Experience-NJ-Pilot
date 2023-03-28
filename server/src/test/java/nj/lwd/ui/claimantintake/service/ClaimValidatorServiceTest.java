package nj.lwd.ui.claimantintake.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.networknt.schema.JsonSchemaFactory;
import com.networknt.schema.SpecVersion;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;

public class ClaimValidatorServiceTest {

    final List<String> noCustomErrors = new ArrayList<>();
    final String testSchemaName = "test/claim-validation-testV1";
    final String invalidClaim =
            """
              {
              "claimant_name": {
                "last_name": 5
              }
            }
            """;

    Map<String, Object> convertStringToMap(String claim)
            throws JsonMappingException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> claimMap = objectMapper.readValue(claim, new TypeReference<>() {});
        return claimMap;
    }

    @Test
    void claimIsValid() throws Exception {
        var customValidationService = mock(CustomValidationService.class);
        when(customValidationService.performCustomValidations(any())).thenReturn(noCustomErrors);
        String validClaim =
                """
                          {
                          "claimant_name": {
                            "first_name": "Joan",
                            "last_name": "Jett"
                          }
                        }
                        """;
        Map<String, Object> validClaimMap = convertStringToMap(validClaim);
        ClaimValidatorService claimValidator =
                new ClaimValidatorService("classpath:", testSchemaName, customValidationService);

        List<String> errorMessages = claimValidator.validateClaim(validClaimMap);
        assert (errorMessages.size() < 1);
    }

    @Test
    void returnsSchemaErrorsForInvalidClaim() throws Exception {
        var customValidationService = mock(CustomValidationService.class);
        when(customValidationService.performCustomValidations(any())).thenReturn(noCustomErrors);

        ClaimValidatorService claimValidator =
                new ClaimValidatorService("classpath:", testSchemaName, customValidationService);

        List<String> errorMessages = claimValidator.validateAgainstSchema(invalidClaim);
        assertEquals(2, errorMessages.size());
        assertTrue(
                errorMessages.contains(
                        "$.claimant_name.first_name: is missing but it is required"));
        assertTrue(
                errorMessages.contains(
                        "$.claimant_name.last_name: integer found, string expected"));
    }

    @Test
    void returnsBothCustomAnSchemaErrors() throws Exception {
        List<String> customErrors = new ArrayList<>();
        customErrors.add("I am a custom error");

        var customValidationService = mock(CustomValidationService.class);
        when(customValidationService.performCustomValidations(any())).thenReturn(customErrors);

        Map<String, Object> inValidClaimMap = convertStringToMap(invalidClaim);
        ClaimValidatorService claimValidator =
                new ClaimValidatorService("classpath:", testSchemaName, customValidationService);

        List<String> errorMessages = claimValidator.validateClaim(inValidClaimMap);
        assertEquals(3, errorMessages.size());
        assertTrue(
                errorMessages.contains(
                        "$.claimant_name.first_name: is missing but it is required"));
        assertTrue(
                errorMessages.contains(
                        "$.claimant_name.last_name: integer found, string expected"));
        assertTrue(errorMessages.contains("I am a custom error"));
    }

    @Test
    void schemaIs2019Dialect() throws Exception {
        var customValidationService = mock(CustomValidationService.class);
        when(customValidationService.performCustomValidations(any())).thenReturn(noCustomErrors);
        try (MockedStatic<JsonSchemaFactory> factory = mockStatic(JsonSchemaFactory.class)) {
            factory.when(() -> JsonSchemaFactory.getInstance(any()))
                    .thenReturn(mock(JsonSchemaFactory.class));

            ClaimValidatorService claimValidator =
                    new ClaimValidatorService(
                            "classpath:", testSchemaName, customValidationService);
            // Print this to prevent spotbugs from being stupid
            System.out.println(claimValidator);
            factory.verify(() -> JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V201909));
        }
    }
}

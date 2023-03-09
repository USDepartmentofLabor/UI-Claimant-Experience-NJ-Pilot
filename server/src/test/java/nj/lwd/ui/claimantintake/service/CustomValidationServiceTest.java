package nj.lwd.ui.claimantintake.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class CustomValidationServiceTest {
    private CustomValidationService customValidationService;

    @BeforeEach
    void beforeEach() {
        customValidationService = new CustomValidationService();
    }

    @Test
    void noErrorsResultWithValidClaim() throws JsonProcessingException {

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> validClaim =
                objectMapper.readValue(
                        """
                                {
                                    "employment_last_date":"2023-03-01",
                                    "employment_start_date":"2003-12-02",
                                    "definite_recall_date":"2023-12-03",
                                    "ssn":"987654321",
                                    "Misc_additionalField":"some other data",
                                  "mailing_address": {
                                    "address": "123 main street",
                                    "city": "San Francisco",
                                    "state": "CA",
                                    "zipcode": "12345"
                                  }
                                }
                                """,
                        new TypeReference<>() {});
        ArrayList<String> errors = customValidationService.performCustomValidations(validClaim);
        assertEquals(0, errors.size());
    }

    @Test
    void doesntReturnErrorsForMissingFields() throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> claimMissingFields =
                objectMapper.readValue(
                        """
                  {
                    "Misc_additionalField":"some other data"

                }
                                    """,
                        new TypeReference<>() {});
        ArrayList<String> errors =
                customValidationService.performCustomValidations(claimMissingFields);
        assertEquals(0, errors.size());
    }

    @Test
    void returnsDateErrors() throws JsonProcessingException {

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> claimWithBadDates =
                objectMapper.readValue(
                        """
                                {
                                    "employment_last_date":"2023-12-01",
                                    "employment_start_date":"2023-12-01",
                                    "definite_recall_date":"2023-03-03"

                                }
                                """,
                        new TypeReference<>() {});

        ArrayList<String> errors =
                customValidationService.performCustomValidations(claimWithBadDates);

        assertEquals(2, errors.size());
        assertTrue(
                errors.indexOf(
                                "Employment last date error: last date cannot be before employment"
                                        + " start date")
                        > -1);
        assertTrue(
                errors.indexOf(
                                "Definite date of recall error: date of recall cannot be before"
                                        + " employment last date")
                        > -1);
    }

    @Test
    void returnsAddressTooLongError() throws JsonProcessingException {

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> claimWithMailingAddress =
                objectMapper.readValue(
                        """
                                {
                                  "mailing_address": {
                                    "address": "123 main street",
                                    "city": "MY CAT WAS ON MY KEYBOARD AND NOW THIS TEXT IS WAYYYY TOO LONG",
                                    "state": "CA",
                                    "zipcode": "12345"
                                  }

                                }
                                """,
                        new TypeReference<>() {});

        ArrayList<String> errors =
                customValidationService.performCustomValidations(claimWithMailingAddress);

        assertEquals(1, errors.size());
        assertEquals(
                "Mailing address error: street and city fields exceed the 44 character maximum",
                errors.get(0));
    }

    @Test
    void returnsSSNErrors() throws JsonProcessingException {

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> validClaim =
                objectMapper.readValue(
                        """
                              {
                                  "ssn":"987000000"
                              }
                              """,
                        new TypeReference<>() {});
        ArrayList<String> errors = customValidationService.performCustomValidations(validClaim);
        assertEquals(2, errors.size());

        assertTrue(errors.indexOf("SSN error: the 4th and 5th characters cannot equal 00") > -1);
        assertTrue(errors.indexOf("SSN error: the 6th and 9th characters cannot equal 0000") > -1);
    }
}

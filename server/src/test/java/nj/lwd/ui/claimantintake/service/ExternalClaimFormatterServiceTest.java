package nj.lwd.ui.claimantintake.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class ExternalClaimFormatterServiceTest {

    private ExternalClaimFormatterService externalClaimFormatterService;

    @BeforeEach
    void beforeEach() {
        externalClaimFormatterService = new ExternalClaimFormatterService();
    }

    @Test
    void formatClaimWithLocalValues() throws Exception {

        Map<String, Object> validClaim =
                (new ObjectMapper())
                        .readValue(
                                """
                    {
                      "claimant_name": {
                        "first_name": "Harry",
                        "last_name": "Potter",
                        "middle_initial": "J"
                      },
                      "residence_address":"1234 something drive",
                      "LOCAL_mailing_address_same":"true",
                      "LOCAL_claimant_has_alternate_names":"true"
                    }
                    """,
                                new TypeReference<>() {});
        Map<String, Object> expectedClaim =
                (new ObjectMapper())
                        .readValue(
                                """
                                    {
                                      "claimant_name": {
                                        "first_name": "Harry",
                                        "last_name": "Potter",
                                        "middle_initial": "J"
                                      },
                                      "residence_address":"1234 something drive",
                                      "mailing_address":"1234 something drive"
                                    }
                                    """,
                                new TypeReference<>() {});
        Map<String, Object> alteredClaim = externalClaimFormatterService.formatClaim(validClaim);
        assertEquals(expectedClaim, alteredClaim);
    }

    @Test
    void formatClaimMissingLocalValues() throws Exception {
        Map<String, Object> validClaim =
                (new ObjectMapper())
                        .readValue(
                                """
                {
                  "claimant_name": {
                    "first_name": "Harry",
                    "last_name": "Potter",
                    "middle_initial": "J"
                  },
                  "residence_address":"1234 something drive"
                }
                """,
                                new TypeReference<>() {});
        Map<String, Object> alteredClaim = externalClaimFormatterService.formatClaim(validClaim);
        assertEquals(validClaim, alteredClaim);
    }

    @Test
    void formatClaimWithDifferentMailingAddress() throws Exception {
        Map<String, Object> validClaim =
                (new ObjectMapper())
                        .readValue(
                                """
                {
                  "claimant_name": {
                    "first_name": "Harry",
                    "last_name": "Potter",
                    "middle_initial": "J"
                  },
                  "residence_address":"1234 something drive",
                  "LOCAL_mailing_address_same":"false",
                  "LOCAL_claimant_has_alternate_names":"true",
                  "mailing_address":"PO BOX 123"
                }
                """,
                                new TypeReference<>() {});
        Map<String, Object> expectedResult =
                (new ObjectMapper())
                        .readValue(
                                """
                                {
                                  "claimant_name": {
                                    "first_name": "Harry",
                                    "last_name": "Potter",
                                    "middle_initial": "J"
                                  },
                                  "residence_address":"1234 something drive",
                                  "mailing_address":"PO BOX 123"
                                }
                                """,
                                new TypeReference<>() {});
        Map<String, Object> alteredClaim = externalClaimFormatterService.formatClaim(validClaim);
        assertEquals(expectedResult, alteredClaim);
    }
}

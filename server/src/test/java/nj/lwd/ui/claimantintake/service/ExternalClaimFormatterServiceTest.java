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
                      "mailing_address":"1234 something drive",
                      "LOCAL_mailing_address_same":"true",
                      "LOCAL_claimant_has_alternate_names":"true",
                      "union_local_number":"12344"
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
                                      "mailing_address":"1234 something drive",
                                      "union_local_number":"12344"
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
                  "residence_address":"1234 something drive",
                  "union_local_number":"12344"
                }
                """,
                                new TypeReference<>() {});
        Map<String, Object> alteredClaim = externalClaimFormatterService.formatClaim(validClaim);
        assertEquals(validClaim, alteredClaim);
    }

    @Test
    void formatClaimWithNestedObjects() throws Exception {
        Map<String, Object> originalClaim =
                (new ObjectMapper())
                        .readValue(
                                """
                {
                  "claimant_name": {
                    "first_name": "Harry",
                    "last_name": "Potter",
                    "middle_initial": "J",
                    "LOCAL_has_fun_name":false
                  },
                  "residence_address":"1234 something drive",
                  "union_local_number":"12344",
                  "employers":[
                    {
                      "employer_name":"Hogwarts",
                      "LOCAL_pays_well":false
                    },
                    {
                      "employer_name":"PotionMakersRUs",
                      "LOCAL_pays_well":true
                    }
                  ]
                }
                """,
                                new TypeReference<>() {});

        Map<String, Object> resultClaimExpected =
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
                                  "union_local_number":"12344",
                                  "employers":[
                                    {
                                      "employer_name":"Hogwarts"
                                    },
                                    {
                                      "employer_name":"PotionMakersRUs"
                                    }
                                  ]
                                }
                                """,
                                new TypeReference<>() {});
        Map<String, Object> alteredClaim = externalClaimFormatterService.formatClaim(originalClaim);
        assertEquals(resultClaimExpected, alteredClaim);
    }
}

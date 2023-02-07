package nj.lwd.ui.claimantintake.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import nj.lwd.ui.claimantintake.exception.RecentEmployerDataRetrievalException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class ExternalClaimFormatterServiceTest {

    private ExternalClaimFormatterService externalClaimFormatterService;
    private static final String claimantIdpId = "fakeId";
    private final Map<String, Object> validRecentEmployerMap =
            new HashMap<String, Object>() {
                {
                    put("statusCode", "3");
                }
            };
    private final Optional<Map<String, Object>> validRecentEmployerOptional =
            Optional.of(validRecentEmployerMap);
    private final ClaimStorageService mockClaimStorage = mock(ClaimStorageService.class);

    @BeforeEach
    void beforeEach() {
        externalClaimFormatterService = new ExternalClaimFormatterService(mockClaimStorage);
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
                                      "union_local_number":"12344",
                                      "wgpm":{
                                        "statusCode":"3"
                                      }
                                    }
                                    """,
                                new TypeReference<>() {});

        when(mockClaimStorage.getRecentEmployers(claimantIdpId))
                .thenReturn(validRecentEmployerOptional);
        Map<String, Object> alteredClaim =
                externalClaimFormatterService.formatClaim(validClaim, claimantIdpId);
        assertEquals(expectedClaim, alteredClaim);
        verify(mockClaimStorage, times(1)).getRecentEmployers(claimantIdpId);
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
                  "union_local_number":"12344",
                  "wgpm":{
                    "statusCode":"3"
                  }
                }
                """,
                                new TypeReference<>() {});
        when(mockClaimStorage.getRecentEmployers(claimantIdpId))
                .thenReturn(validRecentEmployerOptional);
        Map<String, Object> alteredClaim =
                externalClaimFormatterService.formatClaim(validClaim, claimantIdpId);
        assertEquals(validClaim, alteredClaim);
        verify(mockClaimStorage, times(1)).getRecentEmployers(claimantIdpId);
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
                                  ],
                                  "wgpm":{
                                    "statusCode":"3"
                                  }
                                }
                                """,
                                new TypeReference<>() {});

        when(mockClaimStorage.getRecentEmployers(claimantIdpId))
                .thenReturn(validRecentEmployerOptional);
        Map<String, Object> alteredClaim =
                externalClaimFormatterService.formatClaim(originalClaim, claimantIdpId);
        assertEquals(resultClaimExpected, alteredClaim);
        verify(mockClaimStorage, times(1)).getRecentEmployers(claimantIdpId);
    }

    @Test
    void formatClaimWithEmptyWGPM() throws Exception {
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
                  }

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

                                  "wgpm":null
                                }
                                """,
                                new TypeReference<>() {});

        when(mockClaimStorage.getRecentEmployers(claimantIdpId)).thenReturn(Optional.empty());
        Map<String, Object> alteredClaim =
                externalClaimFormatterService.formatClaim(originalClaim, claimantIdpId);
        assertEquals(resultClaimExpected, alteredClaim);
        verify(mockClaimStorage, times(1)).getRecentEmployers(claimantIdpId);
    }

    @Test
    void formatClaimWithMissingWGPM() throws Exception {
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
        }
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

                            "wgpm":null
                          }
                          """,
                                new TypeReference<>() {});

        doThrow(RecentEmployerDataRetrievalException.class)
                .when(mockClaimStorage)
                .getRecentEmployers(anyString());
        Map<String, Object> alteredClaim =
                externalClaimFormatterService.formatClaim(originalClaim, claimantIdpId);
        assertEquals(resultClaimExpected, alteredClaim);
        verify(mockClaimStorage, times(1)).getRecentEmployers(claimantIdpId);
    }
}

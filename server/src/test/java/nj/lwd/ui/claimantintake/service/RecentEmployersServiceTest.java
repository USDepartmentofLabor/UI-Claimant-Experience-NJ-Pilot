package nj.lwd.ui.claimantintake.service;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.junit5.WireMockRuntimeInfo;
import com.github.tomakehurst.wiremock.junit5.WireMockTest;
import java.util.ArrayList;
import nj.lwd.ui.claimantintake.dto.RecentEmployersResponse;
import nj.lwd.ui.claimantintake.dto.WagePotentialEmployerWages;
import nj.lwd.ui.claimantintake.dto.WagePotentialResponseEmployer;
import nj.lwd.ui.claimantintake.exception.WGPMClientException;
import nj.lwd.ui.claimantintake.exception.WGPMServerException;
import org.junit.jupiter.api.Test;
import org.springframework.core.env.Environment;

@WireMockTest
public class RecentEmployersServiceTest {

    static final String testDate = "2022-07-22";
    static final String testSSN = "987654321";
    static final String mockedEndpoint = "/wgpm";

    public void mockEnvironment(String wiremockUrl) {
        var environment = mock(Environment.class);
        when(environment.getProperty("loops.url")).thenReturn(wiremockUrl);
    }

    public String getValidResponseStr() {
        return """
            {
            "responseStatus": "0",
            "ssnEcho": "600207195",
            "claimDateEcho": 1658462,
            "grossMaxBenefitAllowance": 9534.0,
            "weeklyBenefitRate": 681.0,
            "invalidMonetaryInd": false,
            "indeterminateInd": false,
            "wagePotentialMonLookupResponseEmployerDtos": [
              {
                "employerAddressLine1": "DIRECT FUTURE MAIL",
                "employerAddressLine2": "C/O TALX UC EXPRESS",
                "employerAddressLine3": "P O BOX 6001",
                "employerAddressLine4": "PEABODY MA",
                "employerAddressLine5": null,
                "employerAddressZip": "01961",
                "employerTelephoneNumber": "2015265000",
                "employerStatePayrollNumber": null,
                "employerSequenceNumber": "001",
                "wagePotentialMonLookupResponseEmpWageDtos": [
                  {
                    "year": "2022",
                    "nameControl": "\\u0000\\u0000\\u0000\\u0000",
                    "quarterNumber": "1",
                    "quarterWages": 14000.0,
                    "quarterWeeksWorked": 5
                  }
                ],
                "employerFein": "031143718000000",
                "employerName": "EPIC COFFEE, INC"
              },
              {
                "employerAddressLine1": "The Hall of Justice",
                "employerAddressLine2": "2212 superhero street",
                "employerAddressLine3": "SUITE #2",
                "employerAddressLine4": "WASHINGTON DC",
                "employerAddressLine5": null,
                "employerAddressZip": "91121",
                "employerTelephoneNumber": "5554151012",
                "employerStatePayrollNumber": null,
                "employerSequenceNumber": "002",
                "wagePotentialMonLookupResponseEmpWageDtos": [
                  {
                    "year": "2022",
                    "nameControl": "\\u0000\\u0000\\u0000\\u0000",
                    "quarterNumber": "1",
                    "quarterWages": 14000.0,
                    "quarterWeeksWorked": 5
                  }
                ],
                "employerFein": "031143718000011",
                "employerName": "JUSTICE LEAGUE"
              },
              {
                "employerAddressLine1": "123 Secret Identity Street",
                "employerAddressLine2": "Metropolis KS",
                "employerAddressLine3": null,
                "employerAddressLine4": null,
                "employerAddressLine5": null,
                "employerAddressZip": "12345",
                "employerTelephoneNumber": "6092924542",
                "employerStatePayrollNumber": null,
                "employerSequenceNumber": "003",
                "wagePotentialMonLookupResponseEmpWageDtos": [
                  {
                    "year": "2022",
                    "nameControl": "\\u0000\\u0000\\u0000\\u0000",
                    "quarterNumber": "1",
                    "quarterWages": 14000.0,
                    "quarterWeeksWorked": 5
                  }
                ],
                "employerFein": "022248181800000",
                "employerName": "THE DAILY PLANET"
              }
            ],
            "potentialPartialWeeklyBenefitRate": 720.0
          }"""
                .strip();
    }

    public RecentEmployersResponse getValidRecentEmployerAPIResponse() {
        WagePotentialEmployerWages employerWageValue =
                new WagePotentialEmployerWages(
                        "2022", 14000.00, "1", 5, "\\u0000\\u0000\\u0000\\u0000");
        ArrayList<WagePotentialEmployerWages> wageList =
                new ArrayList<WagePotentialEmployerWages>();
        wageList.add(employerWageValue);
        WagePotentialResponseEmployer employer1 =
                new WagePotentialResponseEmployer(
                        null,
                        "PEABODY MA",
                        "P O BOX 6001",
                        "C/O TALX UC EXPRESS",
                        "DIRECT FUTURE MAIL",
                        "031143718000000",
                        "01961",
                        "EPIC COFFEE, INC",
                        null,
                        "6144151035",
                        "001",
                        wageList);

        WagePotentialResponseEmployer employer2 =
                new WagePotentialResponseEmployer(
                        null,
                        "WASHINGTON DC",
                        "SUITE #2",
                        "2212 superhero street",
                        "The Hall of Justice",
                        "031143718000011",
                        "91121",
                        "Justice League",
                        null,
                        "5554151012",
                        "002",
                        wageList);

        WagePotentialResponseEmployer employer3 =
                new WagePotentialResponseEmployer(
                        null,
                        null,
                        null,
                        "Metropolis KS",
                        "123 Secret Identity Street",
                        "022248181800000",
                        "12345",
                        "Daily Planet",
                        null,
                        "6092924542",
                        "003",
                        wageList);
        ArrayList<WagePotentialResponseEmployer> employerList = new ArrayList<>();
        employerList.add(employer1);
        employerList.add(employer2);
        employerList.add(employer3);

        // claimdate needs to be changed to handle the 13 digit long epock timestamp it receives
        RecentEmployersResponse recentEmployerResponse =
                new RecentEmployersResponse(
                        "0",
                        false,
                        false,
                        1658462,
                        9534.00,
                        "600207195",
                        681.00,
                        employerList,
                        817.00);

        return recentEmployerResponse;
    }

    @Test
    void returnsData(WireMockRuntimeInfo wmRuntimeInfo) {

        // mock api success call
        WireMock wireMock = wmRuntimeInfo.getWireMock();
        wireMock.register(
                post(mockedEndpoint)
                        .willReturn(
                                ok().withHeader("Content-Type", "application/json")
                                        .withBody(getValidResponseStr())));

        String baseURL = wmRuntimeInfo.getHttpBaseUrl();
        var environment = mock(Environment.class);
        when(environment.getProperty("loops.url")).thenReturn(baseURL + mockedEndpoint);

        RecentEmployersResponse expectedResponse = getValidRecentEmployerAPIResponse();
        ArrayList<WagePotentialResponseEmployer> expectedEmployers =
                expectedResponse.getWagePotentialMonLookupResponseEmployerDtos();
        RecentEmployersService recentEmployersService = new RecentEmployersService(environment);
        RecentEmployersResponse returnVal =
                recentEmployersService.getRecentEmployerValues(testSSN, testDate);
        ArrayList<WagePotentialResponseEmployer> returnedEmployers =
                returnVal.getWagePotentialMonLookupResponseEmployerDtos();

        assertTrue(returnVal != null);
        assertTrue(returnedEmployers != null);
        assertEquals(expectedEmployers.size(), returnedEmployers.size());
    }

    @Test
    void returnsClientExceptionOnBadRequest(WireMockRuntimeInfo wmRuntimeInfo) {
        WireMock wireMock = wmRuntimeInfo.getWireMock();
        wireMock.register(
                post("/wgpm")
                        .willReturn(
                                aResponse()
                                        .withStatus(400)
                                        .withHeader("Content-Type", "application/json")
                                        .withBody("Client error")));

        String baseURL = wmRuntimeInfo.getHttpBaseUrl();
        var environment = mock(Environment.class);
        when(environment.getProperty("loops.url")).thenReturn(baseURL + mockedEndpoint);

        RecentEmployersService recentEmployersService = new RecentEmployersService(environment);

        assertThrows(
                WGPMClientException.class,
                () -> {
                    recentEmployersService.getRecentEmployerValues(testSSN, testDate);
                });
    }

    @Test
    void returnsClientExceptionOnApiServerError(WireMockRuntimeInfo wmRuntimeInfo) {
        WireMock wireMock = wmRuntimeInfo.getWireMock();
        wireMock.register(
                post("/wgpm")
                        .willReturn(
                                aResponse()
                                        .withStatus(500)
                                        .withHeader("Content-Type", "application/json")
                                        .withBody("Internal server error")));

        String baseURL = wmRuntimeInfo.getHttpBaseUrl();
        var environment = mock(Environment.class);
        when(environment.getProperty("loops.url")).thenReturn(baseURL + mockedEndpoint);

        RecentEmployersService recentEmployersService = new RecentEmployersService(environment);

        assertThrows(
                WGPMServerException.class,
                () -> {
                    recentEmployersService.getRecentEmployerValues(testSSN, testDate);
                });
    }
}

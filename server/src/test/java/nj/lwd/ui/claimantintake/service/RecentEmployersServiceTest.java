package nj.lwd.ui.claimantintake.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import nj.lwd.ui.claimantintake.dto.RecentEmployersResponse;
import nj.lwd.ui.claimantintake.dto.WagePotentialEmployerWages;
import nj.lwd.ui.claimantintake.dto.WagePotentialResponseEmployer;
import nj.lwd.ui.claimantintake.exception.WGPMClientException;
import nj.lwd.ui.claimantintake.exception.WGPMServerException;
import org.junit.jupiter.api.Test;
import org.springframework.core.env.Environment;

public class RecentEmployersServiceTest {
    final String testDate = "2022-07-22";

    public RecentEmployersResponse getValidRecentEmployerAPIResponse() {
        WagePotentialEmployerWages employerWageValue =
                new WagePotentialEmployerWages(
                        "2022", 14000.00, "1", 5, "\u0000\u0000\u0000\u0000");
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
    void returnsData() {
        String testSSN = "987654321";
        // mock api success call
        var environment = mock(Environment.class);
        when(environment.getProperty("loops.url"))
                .thenReturn("http://localhost:9090/mockloopspath");

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
    void returnsClientExceptionOnBadRequest() {
        String testSSN = "0000000000";
        var environment = mock(Environment.class);
        when(environment.getProperty("loops.url"))
                .thenReturn("http://localhost:9090/error400/mockloopspath");

        RecentEmployersService recentEmployersService = new RecentEmployersService(environment);

        assertThrows(
                WGPMClientException.class,
                () -> {
                    recentEmployersService.getRecentEmployerValues(testSSN, testDate);
                });
    }

    @Test
    void returnsClientExceptionOnApiServerError() {
        String testSSN = "0000000000";
        var environment = mock(Environment.class);
        when(environment.getProperty("loops.url"))
                .thenReturn("http://localhost:9090/error500/mockloopspath");

        RecentEmployersService recentEmployersService = new RecentEmployersService(environment);

        assertThrows(
                WGPMServerException.class,
                () -> {
                    recentEmployersService.getRecentEmployerValues(testSSN, testDate);
                });
    }
}

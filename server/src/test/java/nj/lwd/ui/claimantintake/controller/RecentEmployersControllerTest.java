package nj.lwd.ui.claimantintake.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.util.ArrayList;
import nj.lwd.ui.claimantintake.dto.RecentEmployersResponse;
import nj.lwd.ui.claimantintake.dto.WagePotentialEmployerWages;
import nj.lwd.ui.claimantintake.dto.WagePotentialResponseEmployer;
import nj.lwd.ui.claimantintake.service.ClaimStorageService;
import nj.lwd.ui.claimantintake.service.RecentEmployersService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.env.Environment;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@WebMvcTest(controllers = RecentEmployersController.class)
@TestPropertySource(
        properties = {
            "spring.security.oauth2.resourceserver.jwt.issuer-uri = https://some.fake.url"
        })
public class RecentEmployersControllerTest {
    @Autowired private MockMvc mockMvc;
    @MockBean private ClaimStorageService claimStorageService;
    @MockBean private RecentEmployersService recentEmployersService;

    private RecentEmployersResponse validRecentEmployerResponse;
    private RecentEmployersResponse inValidRecentEmployerResponse;

    public RecentEmployersControllerTest() throws Exception {
        this.inValidRecentEmployerResponse = getInvalidRecentEmployerResponse();
        this.validRecentEmployerResponse = getValidRecentEmployerResponse();
    }

    void mockGetSSN() {
        when(claimStorageService.getSSN(anyString())).thenReturn("123456789");
    }

    void mockSaveRecentEmployer(boolean shouldSave) {
        when(claimStorageService.saveRecentEmployer(anyString(), any())).thenReturn(shouldSave);
    }

    public RecentEmployersResponse getValidRecentEmployerResponse() throws JsonProcessingException {
        WagePotentialEmployerWages employerWageValue =
                new WagePotentialEmployerWages("2022", 14000.00, "1", 13, "\u0000\u0000");
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
                        "Justice for All",
                        null,
                        "5554151012",
                        "001",
                        wageList);

        WagePotentialResponseEmployer employer3 =
                new WagePotentialResponseEmployer(
                        null,
                        "Metropolis KS",
                        null,
                        "#7",
                        "123 Secret Identity Street",
                        "031143718000066",
                        "12345",
                        "Daily Planet",
                        null,
                        "1114151035",
                        "001",
                        wageList);
        ArrayList<WagePotentialResponseEmployer> employerList = new ArrayList<>();
        employerList.add(employer1);
        employerList.add(employer2);
        employerList.add(employer3);

        return new RecentEmployersResponse(
                "0", false, false, 16584624, 9534.00, "244555527", 681.00, employerList, 817.00);
    }

    public RecentEmployersResponse getInvalidRecentEmployerResponse() {
        return new RecentEmployersResponse("3", false, false, 0, 0, null, 0, null, 0);
    }

    @Test
    @WithMockUser
    void shouldReturnRecentEmployers() throws Exception {
        mockGetSSN();
        mockSaveRecentEmployer(true);
        var environment = mock(Environment.class);
        when(environment.getProperty("loops.url"))
                .thenReturn("http://localhost:9090/mockloopspath");

        when(recentEmployersService.getRecentEmployerValues(anyString(), anyString()))
                .thenReturn(validRecentEmployerResponse);
        String expectedResponse =
                """
                        [{"employerAddressLine5":null,"employerAddressLine4":"PEABODY MA","employerAddressLine3":"P O BOX 6001","employerAddressLine2":"C/O TALX UC EXPRESS","employerAddressLine1":"DIRECT FUTURE MAIL","employerFein":"031143718000000","employerAddressZip":"01961","employerName":"EPIC COFFEE, INC","employerStatePayrollNumber":null,"employerTelephoneNumber":"6144151035","employerSequenceNumber":"001","wagePotentialMonLookupResponseEmpWageDtos":[{"year":"2022","quarterWages":14000.0,"quarterNumber":"1","quarterWeeksWorked":13,"nameControl":"\u0000\u0000"}]},{"employerAddressLine5":null,"employerAddressLine4":"WASHINGTON DC","employerAddressLine3":"SUITE #2","employerAddressLine2":"2212 superhero street","employerAddressLine1":"The Hall of Justice","employerFein":"031143718000011","employerAddressZip":"91121","employerName":"Justice for All","employerStatePayrollNumber":null,"employerTelephoneNumber":"5554151012","employerSequenceNumber":"001","wagePotentialMonLookupResponseEmpWageDtos":[{"year":"2022","quarterWages":14000.0,"quarterNumber":"1","quarterWeeksWorked":13,"nameControl":"\u0000\u0000"}]},{"employerAddressLine5":null,"employerAddressLine4":"Metropolis KS","employerAddressLine3":null,"employerAddressLine2":"#7","employerAddressLine1":"123 Secret Identity Street","employerFein":"031143718000066","employerAddressZip":"12345","employerName":"Daily Planet","employerStatePayrollNumber":null,"employerTelephoneNumber":"1114151035","employerSequenceNumber":"001","wagePotentialMonLookupResponseEmpWageDtos":[{"year":"2022","quarterWages":14000.0,"quarterNumber":"1","quarterWeeksWorked":13,"nameControl":"\u0000\u0000"}]}]"""
                        .strip();

        this.mockMvc
                .perform(
                        MockMvcRequestBuilders.get("/recent-employers")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON)
                                .with(csrf()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().json(expectedResponse));
        verify(claimStorageService, times(1))
                .saveRecentEmployer("user", validRecentEmployerResponse);
    }

    @Test
    @WithMockUser
    void shouldNotReturnRecentEmployers() throws Exception {
        mockGetSSN();
        mockSaveRecentEmployer(true);
        when(recentEmployersService.getRecentEmployerValues(anyString(), anyString()))
                .thenReturn(inValidRecentEmployerResponse);
        String expectedResponse = "[]";

        this.mockMvc
                .perform(
                        MockMvcRequestBuilders.get("/recent-employers")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON)
                                .with(csrf()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().json(expectedResponse));
        verify(claimStorageService, times(1))
                .saveRecentEmployer("user", inValidRecentEmployerResponse);
    }

    @Test
    @WithMockUser
    void shouldReturnEmptyIfNoSSN() throws Exception {
        when(claimStorageService.getSSN(anyString())).thenReturn(null);
        String expectedResponse = "SSN not found for given claimant, unable to complete request";

        this.mockMvc
                .perform(
                        MockMvcRequestBuilders.get("/recent-employers")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON)
                                .with(csrf()))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().string(expectedResponse));
        verify(claimStorageService, times(0)).saveRecentEmployer(any(), any());
    }

    @Test
    @WithMockUser
    void shouldReturnEmptyIfUnableToSave() throws Exception {
        mockGetSSN();
        mockSaveRecentEmployer(false);
        when(recentEmployersService.getRecentEmployerValues(anyString(), anyString()))
                .thenReturn(validRecentEmployerResponse);
        String expectedResponse = "Received recent employer response, but could not save to S3";

        this.mockMvc
                .perform(
                        MockMvcRequestBuilders.get("/recent-employers")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON)
                                .with(csrf()))
                .andDo(print())
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(expectedResponse));
        verify(claimStorageService, times(1))
                .saveRecentEmployer("user", validRecentEmployerResponse);
    }
}

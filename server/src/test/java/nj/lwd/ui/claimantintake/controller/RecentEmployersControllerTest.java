package nj.lwd.ui.claimantintake.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.util.ArrayList;
import nj.lwd.ui.claimantintake.dto.RecentEmployers;
import nj.lwd.ui.claimantintake.dto.RecentEmployersResponse;
import nj.lwd.ui.claimantintake.dto.WagePotentialResponseEmployer;
import nj.lwd.ui.claimantintake.service.ClaimStorageService;
import nj.lwd.ui.claimantintake.service.RecentEmployersService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
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

    void mockGetSSN() {
        when(claimStorageService.getSSN(anyString())).thenReturn("123456789");
    }

    public RecentEmployers getValidRecentEmployerResponse() throws JsonProcessingException {
        WagePotentialResponseEmployer employer1 =
                new WagePotentialResponseEmployer(
                        null,
                        "PEABODY MA",
                        "P O BOX 6001",
                        "C/O TALX UC EXPRESS",
                        "DIRECT FUTURE MAIL",
                        "031143718000000",
                        "01961",
                        "VICTORIAS SECRET STORES, INC.",
                        null,
                        "6144151035",
                        "001");

        WagePotentialResponseEmployer employer2 =
                new WagePotentialResponseEmployer(
                        null,
                        "WASHINGTON DC",
                        "SUITE #2",
                        "2212 superhero street",
                        "The Hall of Justice",
                        "031143718000011",
                        "91121",
                        "VICTORIAS SECRET STORES, INC.",
                        null,
                        "5554151012",
                        "001");

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
                        "001");
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
                        16584624,
                        9534.00,
                        "244555527",
                        681.00,
                        employerList,
                        817.00);
        return new RecentEmployers(recentEmployerResponse);
    }

    public RecentEmployers getInvalidRecentEmployerResponse() {
        RecentEmployersResponse errorReturn =
                new RecentEmployersResponse("3", false, false, 0, 0, null, 0, null, 0);
        return new RecentEmployers(errorReturn);
    }

    @Test
    @WithMockUser
    void shouldReturnRecentEmployers() throws Exception {
        mockGetSSN();
        when(recentEmployersService.getRecentEmployerValues(anyString(), anyString()))
                .thenReturn(getValidRecentEmployerResponse());
        String expectedResponse =
                """
                [{"employer_name":"VICTORIAS SECRET STORES, INC.","alternate_employer_name":"business llc","employer_address":{"address":"DIRECT FUTURE MAIL\nC/O TALX UC EXPRESS\nP O BOX 6001","city":"PEABODY","state":"MA","zipcode":"01961"},"employer_phone":{"number":"6144151035"},"fein":"031143718000000"},{"employer_name":"VICTORIAS SECRET STORES, INC.","alternate_employer_name":"business llc","employer_address":{"address":"The Hall of Justice\n2212 superhero street\nSUITE #2","city":"WASHINGTON","state":"DC","zipcode":"91121"},"employer_phone":{"number":"5554151012"},"fein":"031143718000011"},{"employer_name":"Daily Planet","alternate_employer_name":"business llc","employer_address":{"address":"123 Secret Identity Street\n#7","city":"Metropolis","state":"KS","zipcode":"12345"},"employer_phone":{"number":"1114151035"},"fein":"031143718000066"}]        """
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
    }

    @Test
    @WithMockUser
    void shouldNotReturnRecentEmployers() throws Exception {
        mockGetSSN();
        when(recentEmployersService.getRecentEmployerValues(anyString(), anyString()))
                .thenReturn(getInvalidRecentEmployerResponse());
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
    }

    @Test
    @WithMockUser
    void shouldReturnEmptyIfNoSSN() throws Exception {
        when(claimStorageService.getSSN(anyString())).thenReturn(null);

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
    }
}

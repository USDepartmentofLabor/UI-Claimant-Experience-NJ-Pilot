package nj.lwd.ui.claimantintake.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.shaded.json.JSONObject;
import nj.lwd.ui.claimantintake.constants.RecentEmployerResponseKeys;
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

    public JSONObject getValidRecentEmployerResponse() throws JsonProcessingException {
        String employersString =
                """
        {
            "responseStatus":"0",
            "indeterminateInd":false,
            "invalidMonetaryInd":false,
            "claimDateEcho":1658462400000,
            "grossMaxBenefitAllowance":9534.00,
            "ssnEcho":"244555527",
            "weeklyBenefitRate":681.00,
            "wagePotentialMonLookupResponseEmployerDtos":[
               {

                  "employerAddressLine5":null,
                  "employerAddressLine4":"PEABODY MA",
                  "employerAddressLine3":"P O BOX 6001",
                  "employerAddressLine2":"C/O TALX UC EXPRESS",
                  "employerFein":"031143718000000",
                  "employerAddressLine1":"DIRECT FUTURE MAIL",
                  "employerAddressZip":"01961",
                  "employerName":"VICTORIAS SECRET STORES, INC.",
                  "employerStatePayrollNumber":null,
                  "employerTelephoneNumber":"6144151035",
                  "employerSequenceNumber":"001"
               },
               {

                  "employerAddressLine5":null,
                  "employerAddressLine4":"WASHINGTON DC",
                  "employerAddressLine3":"SUITE #2",
                  "employerAddressLine2":"2212 superhero street",
                  "employerFein":"031143718000000",
                  "employerAddressLine1":"The Hall of Justice",
                  "employerAddressZip":"01961",
                  "employerName":"Justice League",
                  "employerStatePayrollNumber":null,
                  "employerTelephoneNumber":"6144151035",
                  "employerSequenceNumber":"001"
               },
               {

                  "employerAddressLine5":null,
                  "employerAddressLine4":"Metropolis KS",
                  "employerAddressLine3":null,
                  "employerAddressLine2":"#7",
                  "employerFein":"031143718000000",
                  "employerAddressLine1":"123 Secret Identity Street",
                  "employerAddressZip":"12345",
                  "employerName":"Daily Planet",
                  "employerStatePayrollNumber":null,
                  "employerTelephoneNumber":"6144151035",
                  "employerSequenceNumber":"001"
               }
            ],
            "potentialPartialWeeklyBenefitRate":817.00
         } """;

        JSONObject employersJsonObject =
                new ObjectMapper().readValue(employersString, JSONObject.class);
        return employersJsonObject;
    }

    public JSONObject getInvalidRecentEmployerResponse() {
        JSONObject errorReturn = new JSONObject();
        errorReturn.appendField(RecentEmployerResponseKeys.RESPONSE_STATUS.value, 3);
        return errorReturn;
    }
    // TODO mock the employer service and get the data
    @Test
    @WithMockUser
    void shouldReturnRecentEmployers() throws Exception {
        when(recentEmployersService.getRecentEmployerValues(anyString(), anyString()))
                .thenReturn(getValidRecentEmployerResponse());
        // TODO - remove the null here when change the address dto to not tack on nulls
        String expectedResponse =
                """
            [{"employer_address":{"zipcode":"01961","address":"DIRECT FUTURE MAIL\nC/O TALX UC EXPRESS\nP O BOX 6001","city":"PEABODY","state":"MA"},"employer_phone":{"number":"6144151035"},"employer_name":"VICTORIAS SECRET STORES, INC.","fein":"031143718000000","alternate_employer_name":"TODO_FILL THIS IN"},{"employer_address":{"zipcode":"01961","address":"The Hall of Justice\n2212 superhero street\nSUITE #2","city":"WASHINGTON","state":"DC"},"employer_phone":{"number":"6144151035"},"employer_name":"Justice League","fein":"031143718000000","alternate_employer_name":"TODO_FILL THIS IN"},{"employer_address":{"zipcode":"12345","address":"123 Secret Identity Street\n#7\nnull","city":"Metropolis","state":"KS"},"employer_phone":{"number":"6144151035"},"employer_name":"Daily Planet","fein":"031143718000000","alternate_employer_name":"TODO_FILL THIS IN"}]
        """;

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
}

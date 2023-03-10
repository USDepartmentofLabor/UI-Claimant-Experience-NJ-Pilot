package nj.lwd.ui.claimantintake.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.Arrays;
import nj.lwd.ui.claimantintake.service.ClaimStorageService;
import nj.lwd.ui.claimantintake.service.ClaimValidatorService;
import nj.lwd.ui.claimantintake.service.CustomValidationService;
import nj.lwd.ui.claimantintake.service.ExternalClaimFormatterService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(controllers = CompletedClaimController.class)
@TestPropertySource(
        properties = {
            "spring.security.oauth2.resourceserver.jwt.issuer-uri = https://some.fake.url"
        })
class CompletedClaimControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private ClaimStorageService claimStorageService;
    @MockBean private ClaimValidatorService claimValidatorService;
    @MockBean private CustomValidationService customValidationService;
    @MockBean private ExternalClaimFormatterService externalClaimFormatterService;

    @Test
    @WithMockUser
    void shouldAcceptCompletedClaim() throws Exception {
        ArrayList<String> validationMessageList = new ArrayList<String>();

        when(claimStorageService.completeClaim(anyString(), anyMap())).thenReturn(true);
        when(claimValidatorService.validateClaim(anyMap())).thenReturn(validationMessageList);
        this.mockMvc
                .perform(
                        post("/complete-claim")
                                .content(
                                        """
                                { "claimant":{"first_name":"harry", "last_name": "Potter"}}""")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON)
                                .with(csrf()))
                .andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    void shouldRejectUnauthorizedUser() throws Exception {
        ArrayList<String> validationMessageList = new ArrayList<String>();
        when(claimStorageService.saveClaim(anyString(), anyMap())).thenReturn(true);
        when(claimValidatorService.validateClaim(anyMap())).thenReturn(validationMessageList);
        this.mockMvc
                .perform(
                        post("/completed-claim")
                                .content(
                                        """
                                { "claimant":{"first_name":"harry", "last_name": "Potter"}}""")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON)
                                .with(csrf()))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void shouldRejectEmptyClaim() throws Exception {
        this.mockMvc
                .perform(
                        post("/complete-claim")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON)
                                .with(csrf()))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    void shouldRejectInvalidClaim() throws Exception {

        ArrayList<String> validationErrors =
                new ArrayList(Arrays.asList("I am a fake error", "I am also a fake error"));
        when(claimValidatorService.validateClaim(anyMap())).thenReturn(validationErrors);
        MvcResult result =
                this.mockMvc
                        .perform(
                                post("/complete-claim")
                                        .content(
                                                """
                        { "claimant":{"first_name":"harry", "last_name": "Potter"}}""")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .accept(MediaType.APPLICATION_JSON)
                                        .with(csrf()))
                        .andDo(print())
                        .andExpect(status().isBadRequest())
                        .andReturn();
        System.out.println(result.getResponse().getContentAsString());
        assertEquals(
                """
                                ["I am a fake error","I am also a fake error"]
                                """
                        .strip(),
                result.getResponse().getContentAsString());
    }
}

package nj.lwd.ui.claimantintake.controller;

import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.networknt.schema.CustomErrorMessageType;
import com.networknt.schema.ValidationMessage;
import java.util.HashSet;
import java.util.Set;
import nj.lwd.ui.claimantintake.service.ClaimStorageService;
import nj.lwd.ui.claimantintake.service.ClaimValidatorService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = CompletedClaimController.class)
@TestPropertySource(
        properties = {
            "spring.security.oauth2.resourceserver.jwt.issuer-uri = https://some.fake.url"
        })
class CompletedClaimControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private ClaimStorageService claimStorageService;
    @MockBean private ClaimValidatorService claimValidatorService;

    @Test
    @WithMockUser
    void shouldAcceptCompletedClaim() throws Exception {
        Set<ValidationMessage> validationMessageSet = new HashSet<>();
        when(claimStorageService.completeClaim(anyString(), anyMap())).thenReturn(true);
        when(claimValidatorService.validateAgainstSchema(anyString()))
                .thenReturn(validationMessageSet);
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
        Set<ValidationMessage> validationMessageSet = new HashSet<>();
        when(claimStorageService.saveClaim(anyString(), anyMap())).thenReturn(true);
        when(claimValidatorService.validateAgainstSchema(anyString()))
                .thenReturn(validationMessageSet);
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

        ValidationMessage validationMessage =
                ValidationMessage.of(
                        "type",
                        CustomErrorMessageType.of("ErrorType"),
                        "name",
                        "testschema",
                        "1234",
                        "Not valid type");

        Set<ValidationMessage> validationMessageSet = new HashSet<>();
        validationMessageSet.add(validationMessage);
        when(claimValidatorService.validateAgainstSchema(anyString()))
                .thenReturn(validationMessageSet);

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
                .andExpect(
                        content()
                                .string(
                                        "Save failed, the schema was the correct JSON format but"
                                                + " had invalid data."));
    }
}

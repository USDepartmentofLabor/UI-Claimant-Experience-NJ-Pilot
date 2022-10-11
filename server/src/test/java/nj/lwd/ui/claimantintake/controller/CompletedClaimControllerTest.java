package nj.lwd.ui.claimantintake.controller;

import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@WebMvcTest(controllers = CompletedClaimController.class)
class CompletedClaimControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private ClaimStorageService claimStorageService;
    @MockBean private ClaimValidatorService claimValidatorService;

    @Test
    void shouldAcceptCompletedClaim() throws Exception {
        Set<ValidationMessage> validationMessageSet = new HashSet<>();
        when(claimStorageService.saveClaim(anyString(), anyMap())).thenReturn(true);
        when(claimValidatorService.validateAgainstSchema(anyString()))
                .thenReturn(validationMessageSet);
        this.mockMvc
                .perform(
                        MockMvcRequestBuilders.post("/completed-claim")
                                .content(
                                        """
                                { "claimant":{"first_name":"harry", "last_name": "Potter"}}""")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk());
    } //

    @Test
    void shouldRejectEmptyClaim() throws Exception {
        this.mockMvc
                .perform(
                        MockMvcRequestBuilders.post("/completed-claim")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldRejectInvalidClaim() throws Exception {

        ValidationMessage validationMessage =
                ValidationMessage.of(
                        "type",
                        CustomErrorMessageType.of("ErrorType"),
                        "name",
                        "testchema",
                        "1234",
                        "Not valid type");

        Set<ValidationMessage> validationMessageSet = new HashSet<>();
        validationMessageSet.add(validationMessage);
        when(claimValidatorService.validateAgainstSchema(anyString()))
                .thenReturn(validationMessageSet);

        this.mockMvc
                .perform(
                        MockMvcRequestBuilders.post("/completed-claim")
                                .content(
                                        """
                        { "claimant":{"first_name":"harry", "last_name": "Potter"}}""")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().is5xxServerError())
                .andExpect(
                        content()
                                .string(
                                        "Save failed, the schema was the correct JSON format but"
                                                + " had invalid data."));
    }
}

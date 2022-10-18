package nj.lwd.ui.claimantintake.controller;

import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import nj.lwd.ui.claimantintake.service.SubmissionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@WebMvcTest(controllers = SubmitClaimController.class)
public class SubmitClaimControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private SubmissionService submissionService;

    @Test
    void shouldSubmitSuccessfully() throws Exception {
        when(submissionService.submitClaim(anyMap())).thenReturn(true);

        this.mockMvc
                .perform(
                        MockMvcRequestBuilders.post("/submit")
                                .content(
                                        """
                    { "claimant":{"first_name":"harry", "last_name": "Potter"}}""")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("Save successful"));
    }

    @Test
    void shouldFailToSubmit() throws Exception {
        when(submissionService.submitClaim(anyMap())).thenReturn(false);
        this.mockMvc
                .perform(
                        MockMvcRequestBuilders.post("/submit")
                                .content(
                                        """
                            {"claimant_name":"InvalidValue"}
                            """)
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Unable to submit claim."));
    }
}

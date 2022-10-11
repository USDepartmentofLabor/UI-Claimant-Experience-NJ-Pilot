package nj.lwd.ui.claimantintake.controller;

import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import nj.lwd.ui.claimantintake.service.ClaimStorageService;
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

    @Test
    void shouldAcceptCompletedClaim() throws Exception {
        when(claimStorageService.completeClaim(anyString(), anyMap())).thenReturn(true);
        this.mockMvc
                .perform(
                        MockMvcRequestBuilders.post("/complete-claim")
                                .content(
                                        """
                                { "claimant":{"first_name":"harry", "last_name": "Potter"}}""")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    void shouldRejectEmptyClaim() throws Exception {
        this.mockMvc
                .perform(
                        MockMvcRequestBuilders.post("/complete-claim")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }
}

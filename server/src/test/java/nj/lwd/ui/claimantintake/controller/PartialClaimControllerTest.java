package nj.lwd.ui.claimantintake.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.HashMap;
import java.util.Optional;
import nj.lwd.ui.claimantintake.service.ClaimStorageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@WebMvcTest(controllers = PartialClaimController.class)
class PartialClaimControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private ClaimStorageService claimStorageService;

    @Test
    void shouldAcceptPartialClaim() throws Exception {
        when(claimStorageService.saveClaim(anyString(), anyMap())).thenReturn(true);
        this.mockMvc
                .perform(
                        MockMvcRequestBuilders.post("/partial-claim")
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
                        MockMvcRequestBuilders.post("/partial-claim")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnPartialClaim() throws Exception {
        var partialClaimMap = new HashMap<String, Object>();

        partialClaimMap.put("ssn", "123456789");
        when(claimStorageService.getClaim(anyString())).thenReturn(Optional.of(partialClaimMap));

        this.mockMvc
                .perform(
                        MockMvcRequestBuilders.get("/partial-claim")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ssn").value("123456789"));
    }

    @Test
    void shouldReturnNothingIfNoPartialClaim() throws Exception {
        when(claimStorageService.getClaim(anyString())).thenReturn(Optional.empty());

        this.mockMvc
                .perform(
                        MockMvcRequestBuilders.get("/partial-claim")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("{}"));
    }
}

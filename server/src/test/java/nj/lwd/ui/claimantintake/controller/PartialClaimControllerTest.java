package nj.lwd.ui.claimantintake.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.HashMap;
import java.util.Optional;
import nj.lwd.ui.claimantintake.exception.ClaimDataRetrievalException;
import nj.lwd.ui.claimantintake.service.ClaimStorageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@WebMvcTest(controllers = PartialClaimController.class)
@TestPropertySource(
        properties = {
            "spring.security.oauth2.resourceserver.jwt.issuer-uri = https://some.fake.url"
        })
class PartialClaimControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private ClaimStorageService claimStorageService;

    @Test
    @WithMockUser
    void shouldAcceptPartialClaim() throws Exception {
        when(claimStorageService.saveClaim(anyString(), anyMap())).thenReturn(true);
        this.mockMvc
                .perform(
                        MockMvcRequestBuilders.post("/partial-claim")
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
    void shouldRejectWhenNotAuthenticated() throws Exception {
        when(claimStorageService.saveClaim(anyString(), anyMap())).thenReturn(true);
        this.mockMvc
                .perform(
                        MockMvcRequestBuilders.post("/partial-claim")
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
                        MockMvcRequestBuilders.post("/partial-claim")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON)
                                .with(csrf()))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    void shouldReturnPartialClaim() throws Exception {
        var partialClaimMap = new HashMap<String, Object>();

        partialClaimMap.put("ssn", "123456789");
        when(claimStorageService.getPartialClaim(anyString()))
                .thenReturn(Optional.of(partialClaimMap));

        this.mockMvc
                .perform(
                        MockMvcRequestBuilders.get("/partial-claim")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON)
                                .with(csrf()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ssn").value("123456789"));
    }

    @Test
    @WithMockUser
    void shouldReturnNothingIfNoPartialClaim() throws Exception {
        when(claimStorageService.getPartialClaim(anyString())).thenReturn(Optional.empty());

        this.mockMvc
                .perform(
                        MockMvcRequestBuilders.get("/partial-claim")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON)
                                .with(csrf()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("{}"));
    }

    @Test
    @WithMockUser
    void shouldReturnInternalServerError() throws Exception {
        when(claimStorageService.getPartialClaim(anyString()))
                .thenThrow(ClaimDataRetrievalException.class);

        this.mockMvc
                .perform(
                        MockMvcRequestBuilders.get("/partial-claim")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON)
                                .with(csrf()))
                .andDo(print())
                .andExpect(status().isInternalServerError())
                .andExpect(
                        content()
                                .json(
                                        """
    {"error":"An error occurred retrieving claim data"}
    """));
    }
}

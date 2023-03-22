package nj.lwd.ui.claimantintake.controller;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import nj.lwd.ui.claimantintake.service.BetaTestService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = BetaTestController.class)
@TestPropertySource(
        properties = {
            "spring.security.oauth2.resourceserver.jwt.issuer-uri = https://some.fake.url"
        })
class BetaTestControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private BetaTestService betaTestService;

    @Test
    @WithMockUser
    void acceptsAnHtmlStringBody() throws Exception {
        var result = new BetaTestService.BetaArtifactStorageResult(true, HttpStatus.OK);
        when(betaTestService.storeClaimArtifact(anyString(), anyString())).thenReturn(result);

        mockMvc.perform(
                        post("/beta-test/submit")
                                .content(
                                        """
                <html><body><div>Hello world!</div></body></html>
                """)
                                .contentType(MediaType.TEXT_HTML)
                                .accept(MediaType.TEXT_HTML)
                                .with(csrf()))
                .andDo(print())
                .andExpect(status().is(result.getStatus().value()));

        verify(betaTestService, times(1)).storeClaimArtifact(anyString(), anyString());
    }

    @Test
    @WithMockUser
    void returnsStatusAndErrorWhenArtifactStorageFails() throws Exception {
        var result =
                new BetaTestService.BetaArtifactStorageResult(
                        false, HttpStatus.INTERNAL_SERVER_ERROR, "A message about what went wrong");
        when(betaTestService.storeClaimArtifact(anyString(), anyString())).thenReturn(result);

        mockMvc.perform(
                        post("/beta-test/submit")
                                .content(
                                        """
                <html><body><div>Hello world!</div></body></html>
                """)
                                .contentType(MediaType.TEXT_HTML)
                                .accept(MediaType.TEXT_HTML)
                                .with(csrf()))
                .andDo(print())
                .andExpect(status().is(result.getStatus().value()))
                .andExpect(content().string("A message about what went wrong"));

        verify(betaTestService, times(1)).storeClaimArtifact(anyString(), anyString());
    }
}

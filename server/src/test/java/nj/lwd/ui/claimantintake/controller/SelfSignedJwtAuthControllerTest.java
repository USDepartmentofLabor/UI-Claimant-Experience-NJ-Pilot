package nj.lwd.ui.claimantintake.controller;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@WebMvcTest(controllers = SelfSignedJwtAuthController.class)
@TestPropertySource(
        properties = {
            "spring.security.self-signed-access-tokens-enabled = false",
            "spring.security.oauth2.resourceserver.jwt.issuer-uri = https://some.fake.url"
        })
class SelfSignedJwtAuthControllerTest {

    @Autowired private MockMvc mockMvc;

    @Test
    @WithMockUser
    void devAuthenticateEndpointShouldNotBeAvailable() throws Exception {
        var sub = UUID.randomUUID().toString();

        mockMvc.perform(MockMvcRequestBuilders.post("/dev/authenticate").content(sub).with(csrf()))
                .andDo(print())
                .andExpect(status().isNotFound());
    }
}

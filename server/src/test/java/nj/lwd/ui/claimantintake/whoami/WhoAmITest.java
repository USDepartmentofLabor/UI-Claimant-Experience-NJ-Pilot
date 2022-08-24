package nj.lwd.ui.claimantintake.whoami;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest
class WhoAmIControllerTest {

    @Autowired private MockMvc mockMvc;

    @Test
    void shouldGiveUserInfo() throws Exception {
        this.mockMvc
                .perform(get("/whoami"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(
                        content()
                                .string(
                                        "{\"firstName\":\"Harry\",\"lastName\":\"Potter\",\"email\":\"boy_who_lived@hogwarts.com\"}"));
    }
}

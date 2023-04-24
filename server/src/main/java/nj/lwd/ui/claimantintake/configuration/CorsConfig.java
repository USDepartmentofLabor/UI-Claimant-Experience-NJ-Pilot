package nj.lwd.ui.claimantintake.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
@ConditionalOnWebApplication
public class CorsConfig implements WebMvcConfigurer {

    @Value("${spring.mvc.allowed-origin:#{null}}")
    private String allowedOrigin;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        if (allowedOrigin != null) {
            registry.addMapping("/**").allowedOrigins(allowedOrigin).allowCredentials(true);
        }
    }
}

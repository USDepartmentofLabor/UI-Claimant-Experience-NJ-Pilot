package nj.lwd.ui.claimantintake.configuration;

import java.nio.charset.StandardCharsets;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.resource.OAuth2ResourceServerConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@ConditionalOnWebApplication
public class WebSecurityConfig {

    @Value("#{new Boolean('${spring.security.self-signed-access-tokens-enabled}')}")
    private Boolean selfSignedAccessTokensEnabled;

    @Value("${spring.security.self-signed-access-token-secret:#{null}}")
    private String secret;

    @Value("${spring.mvc.allowed-origin:#{null}}")
    private String allowedOrigin;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        if (Boolean.TRUE.equals(selfSignedAccessTokensEnabled)) {
            http.csrf().ignoringAntMatchers("/dev/authenticate");
        }

        if (allowedOrigin != null) {
            http.cors();
        }

        http.sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.NEVER)
                .and()
                .authorizeHttpRequests(
                        requests -> {
                            if (Boolean.TRUE.equals(selfSignedAccessTokensEnabled)) {
                                requests.antMatchers("/dev/authenticate").permitAll();
                            }
                            requests.antMatchers(
                                            "/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**")
                                    .permitAll();
                            requests.antMatchers("/actuator/health").permitAll();
                            requests.anyRequest().authenticated();
                        })
                .oauth2ResourceServer(OAuth2ResourceServerConfigurer::jwt);

        return http.build();
    }

    @Bean
    @ConditionalOnProperty(
            name = "spring.security.self-signed-access-tokens-enabled",
            havingValue = "true")
    JwtDecoder jwtDecoder() {
        SecretKey key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        return NimbusJwtDecoder.withSecretKey(key).build();
    }
}

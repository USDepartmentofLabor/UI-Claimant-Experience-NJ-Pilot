package nj.lwd.ui.claimantintake.controller;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@ConditionalOnProperty(
        name = "spring.security.self-signed-access-tokens-enabled",
        havingValue = "true")
public class SelfSignedJwtAuthController {

    private final Logger logger = LoggerFactory.getLogger(SelfSignedJwtAuthController.class);

    private final JwtEncoder encoder;

    SelfSignedJwtAuthController(
            @Value("${spring.security.self-signed-access-token-secret}") String secret) {
        SecretKey key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        JWKSource<SecurityContext> immutableSecret = new ImmutableSecret<>(key);
        this.encoder = new NimbusJwtEncoder(immutableSecret);
    }

    /**
     * A request that can be used to generate a self-signed access token. Enabled only in local/ci
     * environments and for (e2e) testing purposes
     *
     * @param subject the unique key, or "sub" of the JWT. Corresponds to cognito unique ID for
     *     users
     * @return A Jwt access token that the application will accept
     */
    @PostMapping("/dev/authenticate")
    public ResponseEntity<String> devAuthenticate(@RequestBody String subject) {
        var sanitizedSub = subject.replaceAll("[\r\n]", "");
        logger.debug("Access token requested for {}", sanitizedSub);
        final String accessToken = generateAccessToken(sanitizedSub);
        logger.debug("Token granted {}", accessToken);
        return ResponseEntity.ok(accessToken);
    }

    /**
     * Given a subject ("sub"), generate a self-signed token for testing purposes
     *
     * @param subject the unique key, or "sub" of the JWT. Corresponds to cognito unique ID for
     *     users
     * @return A Jwt access token that the application will accept
     */
    private String generateAccessToken(String subject) {
        var now = Instant.now();
        JwsHeader header = JwsHeader.with(() -> "HS256").build();
        var claims =
                JwtClaimsSet.builder()
                        .issuer("self")
                        .issuedAt(now)
                        .expiresAt(now.plus(1, ChronoUnit.HOURS))
                        .subject(subject)
                        .build();
        return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}

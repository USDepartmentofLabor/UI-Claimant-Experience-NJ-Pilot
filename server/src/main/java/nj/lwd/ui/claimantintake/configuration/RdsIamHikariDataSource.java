package nj.lwd.ui.claimantintake.configuration;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.util.Pair;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.regions.providers.DefaultAwsRegionProviderChain;
import software.amazon.awssdk.services.rds.RdsUtilities;
import software.amazon.awssdk.services.rds.model.GenerateAuthenticationTokenRequest;

// Inspired by https://blog.jdriven.com/2021/06/configure-hikari-connection-pool-when-using-rds-iam/
// with updates to use AWS SDK for Java 2.x
public class RdsIamHikariDataSource extends HikariDataSource {

    private final Logger logger = LoggerFactory.getLogger(RdsIamHikariDataSource.class);

    public DefaultCredentialsProvider getDefaultCredentialsProvider() {
        return DefaultCredentialsProvider.create();
    }

    public Region getRegion() {
        return new DefaultAwsRegionProviderChain().getRegion();
    }

    @Override
    public String getPassword() {
        return getToken();
    }

    private String getToken() {
        logger.info("Generating RDS authentication token");
        var hostnamePort = getHostnamePort();
        var region = getRegion();
        var credentialsProvider = getDefaultCredentialsProvider();

        RdsUtilities utilities =
                RdsUtilities.builder()
                        .region(region)
                        .credentialsProvider(credentialsProvider)
                        .build();

        GenerateAuthenticationTokenRequest tokenRequest =
                GenerateAuthenticationTokenRequest.builder()
                        .credentialsProvider(credentialsProvider)
                        .username(getUsername())
                        .port(hostnamePort.getSecond())
                        .hostname(hostnamePort.getFirst())
                        .build();

        return utilities.generateAuthenticationToken(tokenRequest);
    }

    private Pair<String, Integer> getHostnamePort() {
        var slashing = getJdbcUrl().indexOf("//") + 2;
        var sub = getJdbcUrl().substring(slashing, getJdbcUrl().indexOf("/", slashing));
        var splitted = sub.split(":");
        return Pair.of(splitted[0], Integer.parseInt(splitted[1]));
    }
}

package nj.lwd.ui.claimantintake.configuration;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Answers.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;

public class RdsIamHikariDataSourceTest {

    @Test
    void shouldGetPassword() {
        RdsIamHikariDataSource rdsIamHikariDataSource = spy(new RdsIamHikariDataSource());
        DefaultCredentialsProvider awsCredentialsProvider =
                mock(DefaultCredentialsProvider.class, RETURNS_DEEP_STUBS);
        Region region = Region.US_EAST_1;
        when(rdsIamHikariDataSource.getDefaultCredentialsProvider())
                .thenReturn(awsCredentialsProvider);
        doReturn(region).when(rdsIamHikariDataSource).getRegion();
        doReturn(
                        "jdbc:postgresql://test-db.abc123.test-region.rds.amazonaws.com:5432/test_database?sslmode=verify-full&sslrootcert=/app/certs/rds-root-ca-test.pem")
                .when(rdsIamHikariDataSource)
                .getJdbcUrl();
        doReturn("test_user").when(rdsIamHikariDataSource).getUsername();
        assertTrue(
                rdsIamHikariDataSource
                        .getPassword()
                        .startsWith(
                                "test-db.abc123.test-region.rds.amazonaws.com:5432/?DBUser=test_user&Action=connect"));
        rdsIamHikariDataSource.close();
    }
}

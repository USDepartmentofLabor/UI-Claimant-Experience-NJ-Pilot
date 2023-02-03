package nj.lwd.ui.claimantintake.service;

import nj.lwd.ui.claimantintake.dto.RecentEmployersResponse;
import nj.lwd.ui.claimantintake.dto.WagePotentialMonLookupRequest;
import nj.lwd.ui.claimantintake.exception.WGPMClientException;
import nj.lwd.ui.claimantintake.exception.WGPMServerException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class RecentEmployersService {
    private final Logger logger = LoggerFactory.getLogger(RecentEmployersService.class);
    private final WebClient webClient;

    @Autowired
    public RecentEmployersService(Environment environment) {

        if (environment == null) {
            this.webClient = null;
        } else {
            String endpointURL = environment.getProperty("loops.url") + "";
            logger.debug("recent employer service endpoint is {}", endpointURL);
            this.webClient =
                    WebClient.builder()
                            .baseUrl(endpointURL)
                            .defaultHeader(
                                    HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                            .build();
        }
    }

    public RecentEmployersResponse getRecentEmployerValues(String ssn, String claimDate)
            throws WGPMClientException, WGPMServerException {
        logger.debug("requesting recent employers");
        WagePotentialMonLookupRequest request = new WagePotentialMonLookupRequest(ssn, claimDate);
        if (webClient == null) {
            logger.error("Webclient is null, endpoint may invalid");
            throw new WGPMServerException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Unable to create connection to the server");
        }
        return webClient
                .post()
                .uri("")
                .accept(MediaType.APPLICATION_JSON)
                .body(Mono.just(request), WagePotentialMonLookupRequest.class)
                .retrieve()
                .onStatus(
                        HttpStatus::is4xxClientError,
                        response -> {
                            var statusCode = response.statusCode();
                            return response.bodyToMono(String.class)
                                    .flatMap(
                                            errorMessage ->
                                                    Mono.error(
                                                            new WGPMClientException(
                                                                    statusCode, errorMessage)));
                        })
                .onStatus(
                        HttpStatus::is5xxServerError,
                        response -> {
                            var statusCode = response.statusCode();
                            return response.bodyToMono(String.class)
                                    .flatMap(
                                            errorMessage ->
                                                    Mono.error(
                                                            new WGPMServerException(
                                                                    statusCode, errorMessage)));
                        })
                .bodyToMono(RecentEmployersResponse.class)
                .block();
    }
}

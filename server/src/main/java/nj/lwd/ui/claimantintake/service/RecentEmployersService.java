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
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

// import java.util.ArrayList;
// import java.util.function.Function;

// import nj.lwd.ui.claimantintake.dto.WagePotentialEmployerWages;

// import nj.lwd.ui.claimantintake.dto.WagePotentialResponseEmployer;

// import org.apache.http.HttpStatus;

// import org.springframework.web.reactive.function.client.ClientResponse;

// import org.springframework.web.reactive.function.client.ExchangeFilterFunctions;
// import org.springframework.web.reactive.function.client.ExchangeStrategies;

@Service
public class RecentEmployersService {
    private final Logger logger = LoggerFactory.getLogger(RecentEmployersService.class);
    //     @Autowired final int size = 16 * 1024 * 1024;
    //     final ExchangeStrategies strategies =
    //             ExchangeStrategies.builder()
    //                     .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(size))
    //                     .build();
    // Should the size be adjusted??

    private final WebClient webClient;

    @Autowired
    public RecentEmployersService(Environment environment) {
        String endpointUrl = environment.getProperty("loops.url") + "/wagepotentialmonlookup/json";
        System.out.println("endpoint is " + endpointUrl);
        this.webClient =
                WebClient.builder()
                        .baseUrl(endpointUrl)

                        // .exchangeStrategies(strategies) // add back in if decide to adjust size
                        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .filter(logRequest()) // delete me
                        // .filter(ExchangeFilterFunctions.statusError(HttpStatus::is5xxServerError,
                        // WGPMClientException::new))
                        .build();
    }
    // This delete this before merging, just for debug purposes
    private static ExchangeFilterFunction logRequest() {
        return ExchangeFilterFunction.ofRequestProcessor(
                clientRequest -> {
                    System.out.println("************TESTING PRINT*****************");
                    System.out.println(
                            String.format(
                                    "Request: %s %s", clientRequest.method(), clientRequest.url()));

                    clientRequest
                            .headers()
                            .forEach(
                                    (name, values) ->
                                            values.forEach(
                                                    value ->
                                                            System.out.println(
                                                                    String.format(
                                                                            "{%s}={%s}",
                                                                            name, value))));
                    System.out.println("printing the body " + clientRequest.body());
                    return Mono.just(clientRequest);
                });
    }

    public RecentEmployersResponse getRecentEmployerValues(String ssn, String claimDate)
            throws WGPMClientException, WGPMServerException {
        WagePotentialMonLookupRequest request = new WagePotentialMonLookupRequest(ssn, claimDate);
        return webClient
                .post()
                .uri("")
                .accept(MediaType.APPLICATION_JSON)
                .body(Mono.just(request), WagePotentialMonLookupRequest.class)
                .retrieve()
                .onStatus(
                        HttpStatus.BAD_REQUEST::equals,
                        clientResponse -> {
                            Mono<String> errorMsg = clientResponse.bodyToMono(String.class);

                            return errorMsg.flatMap(
                                    msg -> {
                                        logger.error(
                                                "Bad Request sent to wgpm endpoint, error response"
                                                        + " was:  ",
                                                msg);
                                        throw new WGPMClientException(
                                                String.format(
                                                        "Client sent bad request to WGPM endpoint."
                                                                + " Actual Error msg is: %s",
                                                        msg));
                                    });
                        })
                .onStatus(
                        HttpStatus.INTERNAL_SERVER_ERROR::equals,
                        clientResponse -> {
                            Mono<String> errorMsg = clientResponse.bodyToMono(String.class);

                            return errorMsg.flatMap(
                                    msg -> {
                                        logger.error(
                                                "WGPM endpoint hit Internal Server Error, response"
                                                        + " was:  ",
                                                msg);
                                        throw new WGPMServerException(
                                                String.format(
                                                        "WGPM endpoint hit Internal Server Error."
                                                                + " Actual Error msg is: %s",
                                                        msg));
                                    });
                        })
                .bodyToMono(RecentEmployersResponse.class)
                .block();
    }
}

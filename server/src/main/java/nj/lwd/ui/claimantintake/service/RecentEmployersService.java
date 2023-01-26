package nj.lwd.ui.claimantintake.service;

import java.util.ArrayList;
import nj.lwd.ui.claimantintake.dto.RecentEmployersResponse;
import nj.lwd.ui.claimantintake.dto.WagePotentialEmployerWages;
import nj.lwd.ui.claimantintake.dto.WagePotentialMonLookupRequest;
import nj.lwd.ui.claimantintake.dto.WagePotentialResponseEmployer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class RecentEmployersService {
    private final Logger logger = LoggerFactory.getLogger(RecentEmployersService.class);
    @Autowired final int size = 16 * 1024 * 1024;
    final ExchangeStrategies strategies =
            ExchangeStrategies.builder()
                    .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(size))
                    .build();
    //     private final WebClient webClient=WebClient
    //     .builder()
    //     .baseUrl("https://countriesnow.space/api/v0.1/countriespopulation/cities")
    //     .defaultCookie("cookieKey", "cookieValue").exchangeStrategies(strategies)
    //     .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
    //     .build();
    private final WebClient webClient;

    public RecentEmployersService() {
        this.webClient =
                WebClient.builder()
                        .baseUrl(
                                "http://claimsbatchst:8080/loops-online-integration-1.0.0/loopsmqapi/v1/wagepotentialmonlookup/json")
                        //     .defaultCookie("cookieKey",
                        // "cookieValue").exchangeStrategies(strategies)

                        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                        .filter(logRequest()) // delete me
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

    public RecentEmployersResponse getRecentEmployerValues(String ssn, String claimDate) {
        WagePotentialMonLookupRequest request = new WagePotentialMonLookupRequest(ssn, claimDate);

        // TODO - delete everything below and send the wgpm api call
        // parameters for call are ssn and claimdate
        // get claim date here instead of in controller?
        System.out.println("BEFORE GET");
        // Working hard coded example
        // String response1=webClient.post()
        // .uri("")
        // .body(Mono.just(request),WagePotentialMonLookupRequest.class)

        // .retrieve()
        // .bodyToMono(String.class).doOnError(throwable -> logger.error("Failed for some reason",
        // throwable))
        // .block();

        RecentEmployersResponse response =
                webClient
                        .post()
                        .uri("")
                        .accept(MediaType.APPLICATION_JSON)
                        .body(Mono.just(request), WagePotentialMonLookupRequest.class)
                        .retrieve()
                        // below results in an error saying it connot convert text to
                        // RecentEmployerResponse
                        .bodyToMono(RecentEmployersResponse.class)
                        // .doOnError(throwable -> logger.error("Failed for some reason",
                        // throwable))
                        .block();

        System.out.println("after get");
        System.out.println(response);
        WagePotentialEmployerWages employerWageValue =
                new WagePotentialEmployerWages("2022", 14000.00, 13, "\u0000\u0000");
        ArrayList<WagePotentialEmployerWages> wageList =
                new ArrayList<WagePotentialEmployerWages>();
        wageList.add(employerWageValue);
        logger.info("Calling recent employer service");
        WagePotentialResponseEmployer employer1 =
                new WagePotentialResponseEmployer(
                        null,
                        "PEABODY MA",
                        "P O BOX 6001",
                        "C/O TALX UC EXPRESS",
                        "DIRECT FUTURE MAIL",
                        "031143718000000",
                        "01961",
                        "EPIC COFFEE, INC",
                        null,
                        "6144151035",
                        "001",
                        wageList);

        WagePotentialResponseEmployer employer2 =
                new WagePotentialResponseEmployer(
                        null,
                        "WASHINGTON DC",
                        "SUITE #2",
                        "2212 superhero street",
                        "The Hall of Justice",
                        "031143718000011",
                        "91121",
                        "Justice for All",
                        null,
                        "5554151012",
                        "001",
                        wageList);

        WagePotentialResponseEmployer employer3 =
                new WagePotentialResponseEmployer(
                        null,
                        "Metropolis KS",
                        null,
                        "#7",
                        "123 Secret Identity Street",
                        "031143718000066",
                        "12345",
                        "Daily Planet",
                        null,
                        "1114151035",
                        "001",
                        wageList);
        ArrayList<WagePotentialResponseEmployer> employerList = new ArrayList<>();
        employerList.add(employer1);
        employerList.add(employer2);
        employerList.add(employer3);

        // claimdate needs to be changed to handle the 13 digit long epock timestamp it receives
        RecentEmployersResponse recentEmployerResponse =
                new RecentEmployersResponse(
                        "0",
                        false,
                        false,
                        16584624,
                        9534.00,
                        "244555527",
                        681.00,
                        employerList,
                        817.00);

        return recentEmployerResponse;
    }
}

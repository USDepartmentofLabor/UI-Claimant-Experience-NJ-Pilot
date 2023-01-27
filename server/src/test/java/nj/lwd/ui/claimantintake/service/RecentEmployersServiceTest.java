package nj.lwd.ui.claimantintake.service;

import java.util.ArrayList;
import nj.lwd.ui.claimantintake.dto.RecentEmployersResponse;
import nj.lwd.ui.claimantintake.dto.WagePotentialEmployerWages;
import nj.lwd.ui.claimantintake.dto.WagePotentialResponseEmployer;
import org.junit.jupiter.api.Test;
// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.junit.jupiter.api.Assertions.assertTrue;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.mock;
// import static org.mockito.Mockito.mockStatic;
// import static org.mockito.Mockito.when;
// import org.reactivestreams.Publisher;

// import org.springframework.core.env.Environment;
// import org.springframework.web.reactive.function.client.WebClient;

// import nj.lwd.ui.claimantintake.dto.WagePotentialMonLookupRequest;

// import reactor.core.publisher.Mono;

public class RecentEmployersServiceTest {
    public RecentEmployersResponse getValidRecentEmployerAPIResponse() {
        WagePotentialEmployerWages employerWageValue =
                new WagePotentialEmployerWages("2022", 14000.00, 13, "\u0000\u0000");
        ArrayList<WagePotentialEmployerWages> wageList =
                new ArrayList<WagePotentialEmployerWages>();
        wageList.add(employerWageValue);
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
    // @BeforeEach
    // void beforeEach() {

    //     var environment = mock(Environment.class);
    //     when(environment.getProperty("loops.url")).thenReturn("testurl");
    @Test
    void returnsData() {
        // String testSSN="600207092";
        // String testDate="2022-07-22";
        // var environment = mock(Environment.class);
        // var webclientStatic = mockStatic(WebClient.class);
        // var builder = mock(WebClient.Builder.class);
        // var webClient= mock(WebClient.class);
        // var postMock= mock(WebClient.RequestBodyUriSpec.class);
        // var requestBody= mock(WebClient.RequestBodySpec.class);
        // var requestHeaders=mock(WebClient.RequestHeadersSpec.class);
        // var response = mock(WebClient.ResponseSpec.class);
        // // var requestbodyParams= mock(<WagePotentialMonLookupRequest,
        // Publisher<WagePotentialMonLookupRequest>> WebClient.RequestHeadersSpec<?> )
        // WagePotentialMonLookupRequest expectedRequest=new
        // WagePotentialMonLookupRequest(testSSN,testDate);
        // when(requestHeaders.header(any(),any())).thenReturn(requestHeaders);

        // when(webClient.post()).thenReturn(postMock);
        // when(postMock.uri("")).thenReturn(requestBody);
        // when(requestBody.accept(any())).thenReturn(requestBody);
        // when(requestBody.body(Mono.just(expectedRequest),
        // WagePotentialMonLookupRequest.class)).thenReturn(requestHeaders);
        // when(requestHeaders.retrieve()).thenReturn(response);
        // when(response.bodyToMono(RecentEmployersResponse.class))
        // .thenReturn(Mono.just(getValidRecentEmployerAPIResponse()));
        // // when(requestBody.body(any(), WagePotentialMonLookupRequest.class)).thenReturn(null)
        // when(environment.getProperty("loops.url")).thenReturn("http://localhost:9090/mockloopspath");
        // webclientStatic.when(WebClient::builder).thenReturn(builder);
        // when(builder.baseUrl(any())).thenReturn(builder);
        // when(builder.defaultHeader(any(), any())).thenReturn(builder);
        // when(builder.filter(any())).thenReturn(builder);

        // //
        // when(webclient.builder().baseUrl(any()).defaultHeader(any(),any()).build()).thenReturn(webclient);
        // when(builder.build()).thenReturn(webClient);

        // // when(webClient.post().uri("").accept(any()).body(any(),
        // WagePotentialMonLookupRequest.class).retrieve()
        // .bodyToMono(RecentEmployersResponse.class)
        // // .block()).thenReturn(getValidRecentEmployerAPIResponse());

        // RecentEmployersService recentEmployersService = new RecentEmployersService(environment);
        // RecentEmployersResponse returnVal =
        //         recentEmployersService.getRecentEmployerValues("600207092", "2022-07-22");

        // assertTrue(returnVal != null);
        // assertTrue(returnVal.getWagePotentialMonLookupResponseEmployerDtos() != null);
        // assertEquals(3, returnVal.getWagePotentialMonLookupResponseEmployerDtos().size());
    }
}

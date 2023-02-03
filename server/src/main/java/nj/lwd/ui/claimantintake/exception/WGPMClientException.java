package nj.lwd.ui.claimantintake.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

public class WGPMClientException extends HttpClientErrorException {
    public WGPMClientException(HttpStatus statusCode, String statusText) {
        super(statusCode, statusText);
    }
}

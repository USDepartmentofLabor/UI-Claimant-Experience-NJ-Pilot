package nj.lwd.ui.claimantintake.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpServerErrorException;

public class WGPMServerException extends HttpServerErrorException {
    public WGPMServerException(HttpStatus status, String message) {
        super(status, message);
    }
}

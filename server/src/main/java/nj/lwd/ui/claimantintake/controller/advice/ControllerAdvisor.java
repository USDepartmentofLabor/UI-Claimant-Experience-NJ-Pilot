package nj.lwd.ui.claimantintake.controller.advice;

import java.util.LinkedHashMap;
import java.util.Map;
import nj.lwd.ui.claimantintake.exception.ClaimDataRetrievalException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class ControllerAdvisor extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ClaimDataRetrievalException.class)
    protected ResponseEntity<Object> handleClaimStorageException(
            ClaimDataRetrievalException ex, WebRequest request) {
        logger.error(ex.getMessage(), ex.getCause());

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", "An error occurred retrieving claim data");

        return handleExceptionInternal(
                ex, body, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request) {

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", "Required request body was not sent");

        return handleExceptionInternal(ex, body, headers, HttpStatus.BAD_REQUEST, request);
    }
}

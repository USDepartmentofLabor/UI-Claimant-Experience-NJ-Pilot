package nj.lwd.ui.claimantintake.dto;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CompleteClaimResponseBody {
    private final String message;
    private final List<String> errors;

    public CompleteClaimResponseBody(String message, List<String> errors) {
        this.message = message;

        // needed to avoid spotbugs error
        this.errors = errors == null ? Collections.emptyList() : new ArrayList<>(errors);
    }

    public String getMessage() {
        return message;
    }

    public List<String> getErrors() {
        // copy needed to avoid spotbugs error
        return new ArrayList<>(errors);
    }
}

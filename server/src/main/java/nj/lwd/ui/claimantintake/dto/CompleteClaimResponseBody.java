package nj.lwd.ui.claimantintake.dto;

import java.util.List;
import java.util.stream.Collectors;

public class CompleteClaimResponseBody {
    private final String message;
    private final List<String> errors;

    public CompleteClaimResponseBody(String message, List<String> errors) {
        this.message = message;
        this.errors = copyList(errors);
    }

    // needed to avoid spotbugs error
    private List<String> copyList(List<String> list) {
        if (list == null) {
            return null;
        }
        return list.stream().collect(Collectors.toList());
    }

    public String getMessage() {
        return message;
    }

    public List<String> getErrors() {
        return copyList(errors);
    }
}

package nj.lwd.ui.claimantintake.service;

import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class ExternalClaimFormatterService {

    public ExternalClaimFormatterService() {}

    public Map<String, Object> formatClaim(Map<String, Object> claimPayload) {
        claimPayload.keySet().removeIf(key -> key.contains("LOCAL"));
        return claimPayload;
    }
}

package nj.lwd.ui.claimantintake.service;

import java.util.Map;
import nj.lwd.ui.claimantintake.constants.ClaimFields;
import org.springframework.stereotype.Service;

@Service
public class ExternalClaimFormatterService {

    public ExternalClaimFormatterService() {}

    public Map<String, Object> formatClaim(Map<String, Object> claimPayload) {
        if (claimPayload.containsKey(ClaimFields.HAS_SAME_MAILING_ADDRESS.getValue())
                && claimPayload.containsKey(ClaimFields.RESIDENCE_ADDRESS.getValue())) {
            Boolean mailingAddressSame =
                    Boolean.parseBoolean(
                            claimPayload
                                    .get(ClaimFields.HAS_SAME_MAILING_ADDRESS.getValue())
                                    .toString());

            // if mailing address is same
            if (mailingAddressSame) {
                claimPayload.put(
                        ClaimFields.MAILING_ADDRESS.getValue(),
                        claimPayload.get(ClaimFields.RESIDENCE_ADDRESS.getValue()));
            }
        }
        claimPayload.remove(ClaimFields.HAS_SAME_MAILING_ADDRESS.getValue());

        claimPayload.remove(ClaimFields.HAS_ALTERNATE_NAMES.getValue());
        return claimPayload;
    }
}

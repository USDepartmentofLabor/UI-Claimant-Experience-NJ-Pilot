package nj.lwd.ui.claimantintake.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import nj.lwd.ui.claimantintake.exception.RecentEmployerDataRetrievalException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExternalClaimFormatterService {
    private final ClaimStorageService claimStorageService;
    private final Logger logger = LoggerFactory.getLogger(ExternalClaimFormatterService.class);

    @Autowired
    ExternalClaimFormatterService(ClaimStorageService claimStorageService) {
        this.claimStorageService = claimStorageService;
    }

    private Object removeLocalValuesFromMap(Object possibleMapObject) {
        Object returnVObject;
        try {
            ObjectMapper oMapper = new ObjectMapper();
            Map<String, Object> map = oMapper.convertValue(possibleMapObject, Map.class);
            map = removeLocalUseOnlyFields(map);
            returnVObject = oMapper.convertValue(map, Object.class);
        } catch (IllegalArgumentException e) {
            // if not a map there is nothing to change
            returnVObject = possibleMapObject;
        }

        return returnVObject;
    }

    public List<Object> convertObjectToList(Object value) {
        List<Object> list = new ArrayList<>();
        if (value.getClass().isArray()) {
            list = Arrays.asList((Object[]) value);
        } else if (value instanceof Collection) {
            list = new ArrayList<>((Collection<?>) value);
        }
        return list;
    }

    public Map<String, Object> removeLocalUseOnlyFields(Map<String, Object> claimPayload) {

        claimPayload.keySet().removeIf(key -> key.contains("LOCAL"));
        for (Map.Entry<String, Object> entry : claimPayload.entrySet()) {

            if (entry.getValue() instanceof ArrayList) {
                List<Object> list = convertObjectToList(entry.getValue());
                for (int i = 0; i < list.size(); i++) {
                    list.set(i, removeLocalValuesFromMap(list.get(i)));
                }
                claimPayload.put(entry.getKey(), list);

            } else if (entry.getValue() != null
                    && !(entry.getValue() instanceof String)
                    && !(entry.getValue() instanceof Boolean)) {
                claimPayload.put(entry.getKey(), removeLocalValuesFromMap(entry.getValue()));
            }
        }
        return claimPayload;
    }

    public Map<String, Object> addCachedRecentEmployerResponse(
            Map<String, Object> claimPayload, String claimantIdpId) {
        Optional<Map<String, Object>> recentEmployers = Optional.empty();
        try {
            recentEmployers = claimStorageService.getRecentEmployers(claimantIdpId);

        } catch (RecentEmployerDataRetrievalException e) {
            claimPayload.put("wgpm", null);
            logger.error(
                    "WGPM will return as an empty object from formatter as exception was thrown."
                            + " Schema validation is expected to fail");
        }
        if (recentEmployers.isEmpty()) {
            claimPayload.put("wgpm", null);
        } else {
            claimPayload.put("wgpm", recentEmployers.get());
        }
        return claimPayload;
    }

    public Map<String, Object> formatClaim(Map<String, Object> claimPayload, String claimantIdpId) {

        Map<String, Object> formattedClaim = removeLocalUseOnlyFields(claimPayload);
        formattedClaim = addCachedRecentEmployerResponse(formattedClaim, claimantIdpId);

        return formattedClaim;
    }
}

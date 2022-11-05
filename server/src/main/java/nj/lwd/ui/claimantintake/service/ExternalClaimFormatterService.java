package nj.lwd.ui.claimantintake.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class ExternalClaimFormatterService {

    public ExternalClaimFormatterService() {}

    private Object removeLocalValuesFromMap(Object possibleMapObject) {
        Object returnVObject;
        Map<String, Object> map = new HashMap<>();
        try {
            ObjectMapper oMapper = new ObjectMapper();
            map = oMapper.convertValue(possibleMapObject, Map.class);
            map = _formatClaimHelper(map);
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

    public Map<String, Object> _formatClaimHelper(Map<String, Object> claimPayload) {
        claimPayload.keySet().removeIf(key -> key.contains("LOCAL"));
        for (String key : claimPayload.keySet()) {

            Object value = claimPayload.get(key);
            if (value instanceof ArrayList) {
                List<Object> list = convertObjectToList(value);
                for (int i = 0; i < list.size(); i++) {
                    list.set(i, removeLocalValuesFromMap(list.get(i)));
                }
                claimPayload.put(key, list);

            } else if (!(value instanceof String) && !(value instanceof Boolean)) {
                claimPayload.put(key, removeLocalValuesFromMap(value));
            }
        }
        return claimPayload;
    }

    public Map<String, Object> formatClaim(Map<String, Object> claimPayload) {

        return _formatClaimHelper(claimPayload);
    }
}

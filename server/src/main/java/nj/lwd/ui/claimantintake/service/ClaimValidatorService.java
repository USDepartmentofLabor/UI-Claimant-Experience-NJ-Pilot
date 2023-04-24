package nj.lwd.ui.claimantintake.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.networknt.schema.JsonSchema;
import com.networknt.schema.JsonSchemaFactory;
import com.networknt.schema.SpecVersion;
import com.networknt.schema.ValidationMessage;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ClaimValidatorService {
    private final Logger logger = LoggerFactory.getLogger(ClaimValidatorService.class);
    private final ObjectMapper mapper = new ObjectMapper();
    private final JsonSchema schema;
    private final CustomValidationService customValidationService;

    @Autowired
    public ClaimValidatorService(
            // TODO: use default values that can access the claim-v1.0.json
            @Value("${RANDOM_SYS_PROP:classpath:}") String baseUrl,
            @Value("${RANDOM_SYS_PROP:claim-v1.0}") String schemaName,
            CustomValidationService customValidationService)
            throws URISyntaxException {
        String schemaUri = baseUrl + "/schemas/" + schemaName + ".json";
        this.schema = getJsonSchemaFromUrl(schemaUri);
        this.customValidationService = customValidationService;
    }

    public List<String> validateClaim(Map<String, Object> claimData) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonData = objectMapper.writeValueAsString(claimData);

        List<String> schemaValidationErrors = validateAgainstSchema(jsonData);
        List<String> customValidationErrors =
                customValidationService.performCustomValidations(claimData);

        return Stream.of(customValidationErrors, schemaValidationErrors)
                .flatMap(Collection::stream)
                .collect(Collectors.toList());
    }

    public List<String> validateAgainstSchema(String jsonData) throws IOException {
        JsonNode node = getJsonNodeFromStringContent(jsonData);
        Set<ValidationMessage> errors = schema.validate(node);
        logErrors(errors);
        return toStringArray(errors);
    }

    private JsonSchema getJsonSchemaFromUrl(String uri) throws URISyntaxException {
        JsonSchemaFactory factory = JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V201909);
        return factory.getSchema(new URI(uri));
    }

    private JsonNode getJsonNodeFromStringContent(String content) throws IOException {
        return mapper.readTree(content);
    }

    private List<String> toStringArray(Set<ValidationMessage> errors) {
        return errors.stream().map(ValidationMessage::getMessage).toList();
    }

    private void logErrors(Set<ValidationMessage> validationMessages) {
        if (validationMessages.size() > 0) {
            // TODO - include claim id when services are connected
            logger.debug("Validation against schema failed, see errors below:");
        }

        validationMessages.forEach(
                e ->
                        logger.debug(
                                "Message: {}; SchemaPath: {}; PathToField: {}",
                                e.getMessage(),
                                e.getSchemaPath(),
                                e.getPath()));
    }
}

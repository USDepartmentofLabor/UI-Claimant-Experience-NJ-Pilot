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
import java.util.Set;
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

    @Autowired
    public ClaimValidatorService(
            @Value("${RANDOM_SYS_PROP:unemployment.nj.gov}") String baseUrl,
            @Value("${RANDOM_SYS_PROP:claim-v1.0}") String schemaName)
            throws URISyntaxException {
        String schemaUri = baseUrl + "/schemas/" + schemaName + ".json";
        this.schema = getJsonSchemaFromUrl(schemaUri);
    }

    public Set<ValidationMessage> validateAgainstSchema(String jsonData) throws IOException {
        JsonNode node = getJsonNodeFromStringContent(jsonData);
        Set<ValidationMessage> errors = schema.validate(node);
        logErrors(errors);
        return errors;
    }

    private JsonSchema getJsonSchemaFromUrl(String uri) throws URISyntaxException {
        JsonSchemaFactory factory = JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V202012);
        return factory.getSchema(new URI(uri));
    }

    private JsonNode getJsonNodeFromStringContent(String content) throws IOException {
        return mapper.readTree(content);
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

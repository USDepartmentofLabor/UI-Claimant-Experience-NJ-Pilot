package nj.lwd.ui.claimantintake.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;

public class WGPMService {
    private final String endpointUrl;

    @Autowired
    public WGPMService(Environment environment) {
        // This should use the desired endpoint url based on the active boot profile
        String endpointUrl = environment.getProperty("loops.url") + "/wagepotentialmonlookup/json";
        this.endpointUrl = endpointUrl;
    }
}

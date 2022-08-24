package nj.lwd.ui.claimantintake.whoami;

import nj.lwd.ui.claimantintake.models.WhoAmI;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/whoami")
public class WhoAmIController {

    @GetMapping
    public WhoAmI whoami() {
        return new WhoAmI(
                "Harry",
                "J",
                "Potter",
                "boy_who_lived@hogwarts.com",
                "2028675309",
                "123-45-6789",
                "1980-07-31");
    }
}

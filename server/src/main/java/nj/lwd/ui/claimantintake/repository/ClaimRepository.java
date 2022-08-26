package nj.lwd.ui.claimantintake.repository;

import java.util.UUID;
import nj.lwd.ui.claimantintake.model.Claim;
import org.springframework.data.repository.CrudRepository;

public interface ClaimRepository extends CrudRepository<Claim, UUID> {}

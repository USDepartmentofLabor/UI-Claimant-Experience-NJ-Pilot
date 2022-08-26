package nj.lwd.ui.claimantintake.repository;

import java.util.UUID;
import nj.lwd.ui.claimantintake.model.Claimant;
import org.springframework.data.repository.CrudRepository;

public interface ClaimantRepository extends CrudRepository<Claimant, UUID> {}

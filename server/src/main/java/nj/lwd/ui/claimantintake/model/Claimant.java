package nj.lwd.ui.claimantintake.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.Instant;
import java.util.*;
import javax.persistence.*;
import nj.lwd.ui.claimantintake.annotation.ExcludeFromGeneratedCodeCoverage;
import nj.lwd.ui.claimantintake.constants.ClaimEventCategory;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@EntityListeners(AuditingEntityListener.class)
public class Claimant {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @Column(nullable = false, unique = true)
    private String idpId;

    @JsonIgnoreProperties("claimant")
    @OneToMany(mappedBy = "claimant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Claim> claims = new ArrayList<>();

    @CreatedDate
    @Column(nullable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;

    protected Claimant() {}

    public Claimant(String idpId) {
        this.idpId = idpId;
    }

    @ExcludeFromGeneratedCodeCoverage
    public UUID getId() {
        return id;
    }

    @ExcludeFromGeneratedCodeCoverage
    public String getIdpId() {
        return idpId;
    }

    @ExcludeFromGeneratedCodeCoverage
    public List<Claim> getClaims() {
        return claims;
    }

    public void addClaim(Claim claim) {
        claims.add(claim);
        claim.setClaimant(this);
    }

    public void removeClaim(Claim claim) {
        claims.remove(claim);
        claim.setClaimant(null);
    }

    @ExcludeFromGeneratedCodeCoverage
    public Instant getCreatedAt() {
        return createdAt;
    }

    @ExcludeFromGeneratedCodeCoverage
    public Instant getUpdatedAt() {
        return updatedAt;
    }

    /**
     * @return all corresponding claims that have not been completed
     */
    List<Claim> getPartialClaims() {
        return claims.stream().filter(claim -> !claim.isComplete()).toList();
    }

    List<Claim> getCompletedClaims() {
        return claims.stream()
                .filter(claim -> claim.isComplete())
                .filter(claim -> !claim.isSubmitted())
                .toList();
    }

    /**
     * Initial business logic only allows for a single active claim, though the architecture
     * supports more than one.
     *
     * @return the partial claim with the most recent save, which is presumably the active partial
     *     claim
     */
    public Optional<Claim> getActivePartialClaim() {
        // TODO: what does this return if there is no active partial claim?
        // Might need to handle a null pointer
        return getPartialClaims().stream()
                .max(
                        (claim1, claim2) -> {
                            Optional<ClaimEvent> claim1LatestSave =
                                    claim1.getLatestEventByCategory(ClaimEventCategory.SAVED);
                            Optional<ClaimEvent> claim2LatestSave =
                                    claim2.getLatestEventByCategory(ClaimEventCategory.SAVED);

                            if (claim1LatestSave.isPresent() && claim2LatestSave.isPresent()) {
                                return claim1LatestSave
                                        .get()
                                        .getUpdatedAt()
                                        .compareTo(claim2LatestSave.get().getUpdatedAt());
                            } else if (claim1LatestSave.isPresent()) {
                                return -1;
                            } else if (claim2LatestSave.isPresent()) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });
    }

    /**
     * As there can be more than one partial claim, allowing multiple complete claims
     *
     * @return the most recently completed claim that has yet to be submitted externally
     */
    public Optional<Claim> getActiveCompletedClaim() {
        return getCompletedClaims().stream()
                .max(
                        (claim1, claim2) -> {
                            Optional<ClaimEvent> claim1LatestComplete =
                                    claim1.getLatestEventByCategory(ClaimEventCategory.COMPLETED);
                            Optional<ClaimEvent> claim2LatestComplete =
                                    claim2.getLatestEventByCategory(ClaimEventCategory.COMPLETED);

                            if (claim1LatestComplete.isPresent()
                                    && claim2LatestComplete.isPresent()) {
                                return claim1LatestComplete
                                        .get()
                                        .getUpdatedAt()
                                        .compareTo(claim2LatestComplete.get().getUpdatedAt());
                            } else if (claim1LatestComplete.isPresent()) {
                                return -1;
                            } else if (claim2LatestComplete.isPresent()) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });
    }

    public Boolean hasPartialClaim() {
        return !getPartialClaims().isEmpty();
    }

    public Boolean hasCompleteClaim() {
        return !getCompletedClaims().isEmpty();
    }
}

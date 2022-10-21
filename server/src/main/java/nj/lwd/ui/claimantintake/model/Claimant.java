package nj.lwd.ui.claimantintake.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.Instant;
import java.util.*;
import javax.persistence.*;
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

    public UUID getId() {
        return id;
    }

    public String getIdpId() {
        return idpId;
    }

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

    public Instant getCreatedAt() {
        return createdAt;
    }

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
     * As there can be more than one partial claim, allowing for a complete event in the case where
     * the coprogram is expanded to allow someone to edit a claim after submission
     *
     * @return the completed claim from the most recent save that has yet to be submitted externally
     */
    public Optional<Claim> getActiveCompletedClaim() {
        return getCompletedClaims().stream()
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

    public Boolean hasPartialClaim() {
        return !getPartialClaims().isEmpty();
    }

    public Boolean hasCompleteClaim() {
        return !getCompletedClaims().isEmpty();
    }
}

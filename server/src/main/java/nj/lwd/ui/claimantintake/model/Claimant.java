package nj.lwd.ui.claimantintake.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Claimant {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @JsonIgnoreProperties("claimant")
    @OneToMany(mappedBy = "claimant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Claim> claims = new ArrayList<>();

    @CreatedDate private Instant createdAt;

    @LastModifiedDate private Instant updatedAt;

    protected Claimant() {}

    public UUID getId() {
        return id;
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
}

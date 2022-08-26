package nj.lwd.ui.claimantintake.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.Instant;
import java.util.UUID;
import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Claim {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @ManyToOne private Claimant claimant;

    @CreatedDate private Instant createdAt;

    @LastModifiedDate private Instant updatedAt;

    protected Claim() {}

    public UUID getId() {
        return id;
    }

    public Claimant getClaimant() {
        return claimant;
    }

    public void setClaimant(Claimant claimant) {
        this.claimant = claimant;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}

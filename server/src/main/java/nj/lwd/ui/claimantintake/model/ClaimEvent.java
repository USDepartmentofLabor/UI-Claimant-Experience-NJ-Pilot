package nj.lwd.ui.claimantintake.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.Instant;
import javax.persistence.*;
import nj.lwd.ui.claimantintake.constants.ClaimEventCategory;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@EntityListeners(AuditingEntityListener.class)
public class ClaimEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "claim_event_generator")
    @SequenceGenerator(name = "claim_event_generator", sequenceName = "claim_event_sequence")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimEventCategory category;

    @ManyToOne private Claim claim;

    @CreatedDate
    @Column(nullable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;

    protected ClaimEvent() {}

    public ClaimEvent(ClaimEventCategory category) {
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public ClaimEventCategory getCategory() {
        return category;
    }

    public Claim getClaim() {
        return claim;
    }

    public void setClaim(Claim claim) {
        this.claim = claim;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}

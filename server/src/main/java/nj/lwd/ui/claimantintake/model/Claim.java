package nj.lwd.ui.claimantintake.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.Instant;
import java.util.*;
import java.util.stream.Stream;
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
public class Claim {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @ManyToOne private Claimant claimant;

    @OneToMany(mappedBy = "claim", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ClaimEvent> events = new ArrayList<>();

    @CreatedDate
    @Column(nullable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;

    public Claim() {}

    @ExcludeFromGeneratedCodeCoverage
    public UUID getId() {
        return id;
    }

    @ExcludeFromGeneratedCodeCoverage
    public Claimant getClaimant() {
        return claimant;
    }

    @ExcludeFromGeneratedCodeCoverage
    public void setClaimant(Claimant claimant) {
        this.claimant = claimant;
    }

    public void addEvent(ClaimEvent event) {
        events.add(event);
        event.setClaim(this);
    }

    @ExcludeFromGeneratedCodeCoverage
    public List<ClaimEvent> getEvents() {
        return events;
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
     * Whether a claim is complete
     *
     * @return true if the claim has a corresponding COMPLETED event, otherwise, false
     */
    public boolean isComplete() {
        return events.stream()
                .map(ClaimEvent::getCategory)
                .anyMatch(event -> event.equals(ClaimEventCategory.COMPLETED));
    }

    /**
     * Whether a claim is submitted
     *
     * @return true if the claim has a corresponding SUBMITTED event, otherwise, false
     */
    public boolean isSubmitted() {
        return events.stream()
                .map(ClaimEvent::getCategory)
                .anyMatch(event -> event.equals(ClaimEventCategory.SUBMITTED));
    }

    private Stream<ClaimEvent> streamEventsByCategory(ClaimEventCategory desiredCategory) {
        return events.stream().filter(event -> event.getCategory().equals(desiredCategory));
    }

    public Optional<ClaimEvent> getLatestEventByCategory(ClaimEventCategory desiredCategory) {
        return streamEventsByCategory(desiredCategory)
                .max(Comparator.comparing(ClaimEvent::getCreatedAt));
    }
}

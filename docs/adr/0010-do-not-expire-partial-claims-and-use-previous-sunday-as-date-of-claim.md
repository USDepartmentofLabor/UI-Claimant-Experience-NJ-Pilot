# Do not expire or delete in-progress partial claims & use the Sunday before submission as date of claim

- Status: Accepted
- Deciders: Decision Record Working Group (DRWG)
- Date: 2022-09-23

This ADR is ported from a DRWG ADR. See the original document for full details:

[ADR 004: Managing Updates to Claimant Info When Resuming A Claim](<https://sonj.sharepoint.com/:w:/r/sites/DOLPublicUIClaimantPortal/Shared%20Documents/Architecture/Architectural%20Decision%20Records%20(ADRs)/004%20-%20ADR%20-%20Managing%20Updates%20to%20Claimant%20Info%20When%20Resuming%20A%20Claim.docx?d=we98645a7488140469ca8303133cf0e5a&csf=1&web=1&e=1eORPc>)

The important key takeaways are extracted below

## Assumptions:

1. Date of Claim is defined as the Sunday before the claim is submitted.
1. In-Process claims will not be expired / deleted.
   - Implementation of an expiration date / deletion will be revisited after initial launch of the Claimant Intake App.
   - One approach to this would be to expire claim-specific information on drafts, while elements like work status, address, etc may be preserved. The logic is that if someone takes more than a few weeks to file a claim, it’s likely that they’re actually working on a new claim and wage info could materially change. (see [this slack convo](https://trussworks.slack.com/archives/C03HPL8S1BL/p1671486940732499) for attribution and further context)
   - NOTE: We anticipate that an expiration date will be added at a later time – at which point this DR will need to be revisited.

## Decision Outcome:

Since in-progress claims will not be expired / deleted, each time a claimant returns to the saved application, we check the wage data via the API. If the wage data has changed from what the initial API pulled the previous time, the new information is populated and any manual edits previously made by the claimant are lost.

- `+` This option increases chances of claim being agentless.
- `-` Increases claimant workload when wage data has changed.
- `±` Requires thoughtful messaging so that the claimant understands the potential impact of saving / returning to a claim.
- `±` Requires thoughtful messaging so that the claimant understands that they will be paid from the Sunday before the date that the application is submitted — so submitting sooner is better.

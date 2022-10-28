# Resolves #00

[Acceptance flow diagram](https://github.com/newjersey/dol-ui-claimant-intake/blob/main/docs/development-acceptance-flow.drawio.svg)

<!--
    If applicable, insert the GH issue number in the markdown header above.
    The hyperlink will be filled in by GitHub magic.
    The key word "Resolves" before the issue number will mark the issue as done when merged.
    Insert a non-keyword if you don't want the issue marked done upon merge)
--->

## Changes proposed in this pull request

- Change 1
- Change 2

<!--
    Please add/remove/edit any of the template below to fit the needs
    of this specific PR
--->

## Reviewer Notes

<!--
    Is there anything you would like reviewers to give additional scrutiny?
--->

## Setup

<!--
    Add any steps or code to run in this section to help others run your code:

    ```sh
    echo "Code goes here"
    ```
--->

## Code Review Verification Steps

[How we work](https://github.com/newjersey/dol-ui-claimant-intake/blob/main/docs/CONTRIBUTING.md)

### As the original developer, I have

#### Satisfied acceptance criteria and met development standards

- [ ] Met the acceptance criteria, or will meet them in a subsequent PR
- [ ] Created/modified automated tests
- [ ] For any fields that have been edited in or removed from the claim form, corresponding edits have been made in the [json schema](https://github.com/newjersey/dol-ui-claimant-intake/blob/main/schemas/claim-v1.0.json) _and_ synced to the ["all-fields" schema](https://github.com/newjersey/dol-ui-claimant-intake/blob/main/schemas/claim-v1.0-all-fields.json)
- [ ] For any fields _added_ to the claim form, naming convention was copied from the ["all-fields" schema](https://github.com/newjersey/dol-ui-claimant-intake/blob/main/schemas/claim-v1.0-all-fields.json)
- [ ] For any edits to the json schema(s), corresponding updates were made to the [Schema fields spreadsheet](https://sonj.sharepoint.com/:x:/r/sites/DOLPublicUIClaimantPortal/Shared%20Documents/General/Schema%20Info/WIP%20Intake%20App%20Schema%20fields.xlsx?d=wd40d93c3565d4eb6aa7eb1a88f3d8bb0&csf=1&web=1&e=ZNi7Px)
- [ ] Followed guidelines for [zero-downtime deploys](https://spring.io/blog/2016/05/31/zero-downtime-deployment-with-a-database) for any database schema changes

#### Validated user-facing changes ([detailed instructions)](https://github.com/newjersey/dol-ui-claimant-intake/tree/main/docs/a11y-testing-instructions.md):

- [ ] Checked responsiveness in mobile, tablet, and desktop
- [ ] Checked keyboard navigability
- [ ] Tested with [VoiceOver](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts) in Safari
- [ ] Checked VO's [rotor menu](https://github.com/trussworks/accessibility/wiki/How-to-use-the-rotor-menu-in-VoiceOver) for landmarks, page heading structure and links
- [ ] Used a browser a11y tool to check for issues (WAVE, axe, or Accessibility addon tab for Storybook)
- [ ] Requested a design review for user-facing changes

### As code reviewer(s), I have

#### Reviewed, tested, and left feedback about the changes

- [ ] Pulled this branch locally and tested it
- [ ] Reviewed this code and left comments
- [ ] Checked that all code is adequately covered by tests
- [ ] Verified that application changes affecting the json schema have corresponding schema changes
- [ ] Made it clear which comments need to be addressed before this work is merged
- [ ] Considered marking this as accepted even if there are small changes needed

#### Validated user-facing changes ([detailed instructions)](https://github.com/newjersey/dol-ui-claimant-intake/tree/main/docs/a11y-testing-instructions.md):

- [ ] Checked responsiveness in mobile, tablet, and desktop
- [ ] Checked keyboard navigability
- [ ] Tested with [VoiceOver](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts) in Safari
- [ ] Checked VO's [rotor menu](https://github.com/trussworks/accessibility/wiki/How-to-use-the-rotor-menu-in-VoiceOver) for landmarks, page heading structure and links
- [ ] Used a browser a11y tool to check for issues (WAVE, axe or Accessibility addon tab for Storybook)

### As a designer reviewer, I have

#### Verified that the changes match the design intention

- [ ] Checked in the design translated visually
- [ ] Checked behavior
- [ ] Checked different states (empty, one, some, error)
- [ ] Checked for landmarks, page heading structure, and links
- [ ] Tried to break the intended flow

#### Validated user-facing changes ([detailed instructions)](https://github.com/newjersey/dol-ui-claimant-intake/tree/main/docs/a11y-testing-instructions.md):

- [ ] Checked responsiveness in mobile, tablet, and desktop
- [ ] Checked keyboard navigability

* Tested general usability, landmarks, page header structure, and links with a screen reader (one per reviewer, min 2 across reviewers):
  - [ ] [VoiceOver](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts) in Safari
  - [ ] [JAWS](https://docs.google.com/document/d/1YGVMAbQgBVYaPhTgzJeMer1iMpBsOSVCshyyu-vmGi4/edit#heading=h.4ufpsgyrhe3p) in Chrome
  - [ ] [NVDA](https://www.nvaccess.org/files/nvda/documentation/userGuide.html) in Chrome
* Used a browser a11y tool to check for issues
  - [ ] [WAVE](https://wave.webaim.org/)
  - [ ] [axe](https://www.deque.com/axe/devtools/)
  - [ ] [ANDI](https://www.ssa.gov/accessibility/andi/help/install.html#install)
  - [ ] For storybook-only components, use the accessibility tab in Storybook.

## Screenshots

<!-- If this PR makes visible interface changes, an image of the finished interface can help reviewers
and casual observers understand the context of the changes.
A before image is optional and can be included at the submitter's discretion.

Consider using an animated image to show an entire workflow.
You may want to use [GIPHY Capture](https://giphy.com/apps/giphycapture) for this! 📸

_Please frame images to show useful context but also highlight the affected regions._
--->

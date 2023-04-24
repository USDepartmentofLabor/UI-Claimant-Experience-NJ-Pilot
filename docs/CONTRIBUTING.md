# Welcome to the contributing guide

This guide should provide all the information needed to understand "How We Work", how this project was developed, and how
we recommend the project be maintained long-term. It should answer all the process questions from high-level flow to
specifics like branch naming and branching strategy.

If ever contributing guidelines are missing or unclear, add/update them here!

## Getting started

To get an overview of the project and to find setup instructions, read the [README](../README.md) if you have not already.
Setting up the repository locally is required to be able to make changes.

## Issues

This project uses [Github Issues](https://docs.github.com/en/issues) to outline work that needs to be done.

Speaking of project work, we're also using [Github Projects (Beta)](https://docs.github.com/en/issues/trying-out-the-new-projects-experience/about-projects)
to track work within Agile sprints.

The project categorizes each issue as either a story, chore, bug, or spike and
assigns each issue a complexity rating - also known as a
[StoryPoint](https://scrumdictionary.com/term/storypoint/) - using the
Fibonacci sequence (1, 2, 3, 5, 8, ...). Some teams may choose not to point
chores or bugs, but we've decided to point all issues and rely on other
mechanisms to distinguish velocity based on issue type as needed.

- We point all [chores](https://scrumdictionary.com/term/chore/) as 2.

### Create a new issue

It's always a good idea to double-check if an issue already exists for the scope of what you'd like to add, try
[searching for the issue if there's a large backlog already](https://docs.github.com/en/github/searching-for-information-on-github/searching-on-github/searching-issues-and-pull-requests#search-by-the-title-body-or-comments).
If a related issue doesn't exist, you can open a new issue using a relevant [issue form](https://github.com/USDepartmentofLabor/UI-Claimant-Experience-NJ-Pilot/issues/new/choose).

### Resolve an issue

If working in an Agile sprint (how the project was set up to be managed), grab an issue from the backlog in the current sprint
Otherwise, scan through the existing issues to find one that interests you.

Most of the time, handling an issue will require making code changes. Keep reading, as this document outlines standard
process for making and submitting code changes.

## Make Changes

### Make changes locally

1. Clone the [repository](https://github.com/USDepartmentofLabor/UI-Claimant-Experience-NJ-Pilot)
1. Follow the instructions in the [README](../README.md) to set up your development environment.
1. When ready to begin working on your chosen/assigned [issue](#issues), create a new branch using the following naming convention:
   ```
   {ISSUE_NUMBER}-{DEVELOPER_INITIALS}-{SHORT_DESCRIPTION}
   ```
   e.g. `123-fl-update-contributing-documentation`
1. Start making changes!
   - Try to make frequent commits with granular, concise descriptions, as that facilitates easier code review.
   - There are a number of [pre-commit hooks](../.pre-commit-config.yaml) used to ensure that each commit undergoes
     basic linting and catches common gotchas and formatting discrepancies automatically.
   - Use the various tools at your disposal to add confidence to your changes
     - Write automated unit tests (Code coverage thresholds are enforced).
     - Write tests in the "given, when, then" format whenever possible
     - Write end-to-end tests to test entire user flows involving integrations with different parts of the application
       (e.g. client/server communication, database persistence, caching behavior).
     - Write [storybook](https://storybook.js.org/) stories for user-facing work.
     - Run the application locally and manually verify desired behavior.

### Pull Request

A pull request can be opened at any stage, typically against the `main` branch. If the changes are not ready for reviewers
to go through a full review, please mark the PR as draft. There are several advantages to opening a PR early that may
suit your needs:

- A linkable, documentable, discussable diff in the Github user interface is made available for collaboration and questions.
- The Github Actions workflows still run against the PR, allowing you to see if all the checks and tests still pass with
  your changes.

When you are satisfied with your changes, open a [new Pull Request (PR)](https://github.com/USDepartmentofLabor/UI-Claimant-Experience-NJ-Pilot/compare)
for someone to review, or mark your draft PR as ready for review.
Fill out the relevant sections of the pre-populated pull request template in the body of your pull request.
[Code owners](../.github/CODEOWNERS) will automatically be added as reviewers to the PR, but feel free to add others
who might have relevant knowledge and availability for review. Add a designer if there is a user interface change.

#### Code Review

Some acknowledgement of PRs should be made within ~24hrs (though the review does not have to happen within that time frame).
It's okay to tag folks in Slack/Teams to notify people of a PR, if things are urgent, or no acknowledgement is made.

At least one engineer must approve a PR. If there is a user interface element to the PR, a designer must also approve the PR.
Consider getting more than one engineer approval if it is a very large PR, you want various perspectives on an approach,
or there is value in bringing different expertises to the review.

Use the "Request changes" feature. If requested changes can't be approved by the requester,
another reviewer should approve before any override of requested changes happens.
Feel free to take discussion to Slack/Teams for lengthy near-real-time discussions on specifics.

Use "suggested changes" suggestion to show clear diffs of what changes you might want to see.

Once all automated checks pass, and an approving review is given, the PR can be merged. We prefer to squash and merge.
In this case, the title of the PR becomes the commit message,
so make sure the title is a fitting description. The individual commits become the commit body. Typically, the developer who
opened the PR should press the big green button.

#### Resolving comments

It is not required that comments get "resolved", but they should at least be acknowledged (emoji or response comment).
Use discretion to resolve comments that you feel have been addressed.

As the PR opener, resolving comments can be a good way to "check off" items that you have addressed. Add a link to the commit sha,
and resolve to track which commits are intended to resolve the conversation in that case.

If discussion resolves the comment thread, feel free to resolve it when consensus or compromise is reached.

As the person giving the feedback, if you notice that your comment has been addressed, and the conversation is not resolved, feel free to resolve it.

### Your PR is merged!

Congratulations :tada::tada:

Once your changes are merged to `main`, they will be eligible to be picked up by [CI/CD pipelines](./cicd-deployments.md) for deployment in lower
environments on the path to production.

## Dependabot

This project uses [Dependabot](https://docs.github.com/en/code-security/dependabot) to keep dependencies up-to-date.
Dependabot configuration for this project can be found [here](../.github/dependabot.yml).
The team reviews and approves dependabot Pull Requests as they come in, based on availability, severity, and compatibility (i.e. less breaking changes are more likely to be merged faster).
No one particular person is responsible for, but the entire engineering team is accountable for, shepherding dependabot updates through.

For dependencies following [Semver](https://semver.org/), minor and patch version updates are low-risk and require minimal to no manual testing.
Major version updates may not introduce breaking changes, but are deserving of additional scrutiny.

The most efficient way to enable dependabot PRs to be merged is to leave an approving PR review with the comment `@dependabot squash and merge`.

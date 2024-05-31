# Deciding our Source Code Architecture

## Context and Problem Statement
When starting the project, our group debated over how our source code for the project should be organized. Some thought it should be by feature, but some thought it should be separated by assets, 
HTML, CSS, JS, and testing.

<!-- This is an optional element. Feel free to remove. -->
## Decision Drivers
Our debate was really split between those two groups mentioned above, so each group drove one decision
- The group who thought it should be by feature (Calendar, Journal, Task List) thought it would be easier to work in groups within folders for each of these features
- The group who thought it should be by file type (assets, HTML, CSS, etc) thought it would be easier to have everything organized for everyone to see. Also, this structure was used in previous labs.

## Considered Options
- Option one was to break up into teams and work within our own folders for each feature
- Option two was to break into teams but have the folders split by file type.
## Decision Outcome

Chosen option: Architecture by Feature <br>
We felt that it would be best to have the code split up into folders for each feature. This was because we thought it would be easy to work amongst our own teams first, then merge everything altogether later.
We wanted all the files to be sorted into each feature, so it was clear what was being modified.

<!-- This is an optional element. Feel free to remove. -->
### Consequences
With our architecture decided by feature, each of the folders in our repo are clearly set for each feature. It is easy to work on by team and locally, and all the work is organized per feature, per team. We
 do however not have the option to see everybody's work while we are working within our groups's folder/feature. We have to check the repo itself on the Github for this sprint, and wait until everything is merged together
 first.

<!-- This is an optional element. Feel free to remove. -->
## Pros and Cons of the Options

### Architecture By Feature

* Good, because makes working within your team easier
* Good, because organizing folder by feature seemed more intuitive to us
* Bad, because team members cannot see other team's work as easy since each team is more isolated to their own folders

### Architecture by File Type

* Good, because team members can see other team progress easily since it is all easier to view
* Bad, because when working on your team's feature, will constantly have to switch between folders

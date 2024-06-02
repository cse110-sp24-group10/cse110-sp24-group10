# Deciding how to incorporate CodeMirror dependency

## Context and Problem Statement

When planning for the project, we had decided that our project would be divided into three sections: calendar, task-list and journal.
In the journal section, we had planned that we would have a section dedicated towards showing what tasks had been accomplished that day alonsgside a textual report and what one had accomplished coding-wise.
To show the coding-status, we had decided as a team that it would only make sense if we implemented a codemirror dependency.
However, when searching for codemirror, there existed two version: 5.65.16 and 6. The problem is which version would be appropriate for our version since
the codemirror feature does not need to have a high amount of functionality other than recording code.

## Decision Drivers

* Needed to store code and present it in a way which hugely mirrors how code would look in coding environments
* Easy to incorporate CodeMirror in our code **(Biggest priority)**


## Considered Options

* Using Version 5.65.16 or Version 6

## Decision Outcome

Chosen option: Using Version 5.65.16. Incorporating Version 6 into our code involved a process which was too complicated that the team was stuck on the problem for 2 hours
to no avail. Switching to Version 5.65.16 proved to be a good decision due to the fact that incorporating it into our webpage in a successful manner was fairly simply(only took 20 minutes).

### Consequences

* Good, because CodeMirror does not have a huge amount of purpose in our code other than storing and showing how much we have accomplished  or wished to accomplish code-wise
* Bad, because this is not the Newest Version meaning that it may not have certain useful features that the new version of CodeMirror could have

## Pros and Cons of the Options

### Version 5.65.16
* Good, because its incorporation into our code was easy and not time-consuming. Tutorials to incorporate this version was hugely reliable.
* Neutral, because the CodeMirror's purpose is to just store code and show it in a presentable manner. 
* Bad, because it is not the latest version available meaning that certain useful features in the latest version would not exist in this version

### Version 6

* Good, because it is the latest version
* Neutral, because the CodeMirror's purpose is to just store code and show it in a presentable manner. 
* Bad,  because its incorporation into our code was not easy and immensely time-consuming. Resources to incorporate this version was not reliable


## More Information

We will continue to monitor the implementation of When2Meet/LettuceMeet and gather feedback from group members to ensure it continues to meet our scheduling and productivity needs effectively. 

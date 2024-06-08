# Deciding how to incorporate CodeMirror dependency

## Context and Problem Statement

When planning for the project, we noticed that in the journal section, there were various programming languages one could write their code in. This would result in us requiring to have a functionality which would us to store code for each seperate language. However we need to decide how, if we decide to change from one programming language to another, we store the code already written for that section.

## Decision Drivers

* What would be most appropriate for any project


## Considered Options

* Write code for one particular language but if we decide to change language, the code written for that particular language is not saved
* Write code for one particular language and if we decide to change language, the code written for that particular language is saved
* Write code for one particular language and if we decide to change language, the code written for that particular language is saved in all other programming language sections

## Decision Outcome

Chosen option: Write code for one particular language and if we decide to change language, the code written for that particular language is saved.
The reason for this is because code written in one programming language cannot be translated into another language without added complexities. So, if we 
want to write code for some other language, we can write that code seperately. This feature would also be perfect if we are using multiple languages. Additionally,
it also ensures that if we, by mistake, change programming languages then code copy-pasted is not lost.

### Consequences

* Good, if we accidentally change languages, we have not lost the code we have written for a particular programming language
* Good, because it allows for us to store code  in different coding languages
  

## Pros and Cons of the Options

### Write code for one particular language but if we decide to change language, the code written for that particular language is not saved
* Good, because it might encourage programmers to be as simplistic in their code as possible(i.e: focusing on writing code in only one programming language)
* Bad, because if we change programming languages by mistake, progress would be lost
  
### Write code for one particular language and if we decide to change language, the code written for that particular language is saved in all other programming language sections
* Bad, because if code written in one programming language is transmitted over to other programming languages section, it would defeat the purpose of the ability to
enable our code entering section of the journal to have multiple programming languages since language conventions are more likely to be flouted

## More Information

NA

# Deciding how to incorporate CodeMirror dependency

## Context and Problem Statement

When planning for the project, we noticed that we would require to have a tool which would make writing of the code in JavsScript more easier for us
since when writing our code, there could exist unintentional errors in our code such as syntax errors. If we have such a tool, we would be able to write our
code easier.

## Decision Drivers

* Allows for autofix
* Customizable rules to ensure meets our code writing convention style
* Fast performance


## Considered Options

* Using ESLint or TSLint 

## Decision Outcome

Chosen option: Using ESLint. 

### Consequences

* Good, because rules of ESLint can be configured allowing us to create custom rules to ensure that code meets our convention style
* Bad, because the amount of development overhead could slow down the entire process of writing code if its incorporation into our project cannot be optimized 

## Pros and Cons of the Options

### ESLint
* Good, because rules of ESLint can be configured allowing us to create custom rules to ensure that code meets our convention style
* Good, because ESLint allows for incremental linting(autochecking of code) ,which only lints changed files, reducing the time required for linting large projects.
* Bad, because the amount of development overhead could slow down the entire process of writing code if its incorporation into our project cannot be optimized
  
### TSLint

* Good, because rules of TSLint can be configured allowing us to create custom rules just like ESLint 
* Bad,  because its performance can be slower than ESLint
* Bad, because community support for TSLint has diminished compared to ESLint meaning that TSLint has fewer updatesless community-contributed content, and limited resources for troubleshooting.


## More Information

NA

# Deciding how to incorporate CodeMirror dependency

## Context and Problem Statement

When planning for the project, we noticed that we would require to have a tool which would make writing of the code in JavsScript more easier for us
since when writing our code, there could exist unintentional errors in our code such as syntax errors. If we have such a tool, we would be able to write our
code easier.

## Decision Drivers

* Allows for autofix
* Customizable rules to ensure code writeup meets our standards set for our project
* Fast performance


## Considered Options

* Using ESLint or prettier. 

## Decision Outcome

Chosen option: Using ESLint. Compared to Prettier, ESLint is more focused on code quality and adherence to best practices. Furthermore,
this option gives us freedom to implement our own form of code formatting rather than follow a set rule, thus ensuring that code written 
is presented in a way that would make most sense, when taking context of the project into account.

### Consequences

* Good, because rules of ESLint can be configured allowing us to create custom rules to ensure that code meets our convention style
* Good, because to find and fix problematic patterns or code that doesn’t adhere to certain style guidelines such as unused variables, unreachable code and syntax 
* Bad, because the amount of development overhead could slow down the entire process of writing code if its incorporation into our project cannot be optimized 

## Pros and Cons of the Options

### ESLint
* Good, because rules of ESLint can be configured allowing us to create custom rules to ensure that code meets our convention style
* Good, because ESLint allows for incremental linting(autochecking of code) ,which only lints changed files, reducing the time required for linting large projects.
* Good, because ESLint can help find problematic patterns or code that doesn’t adhere to certain style guidelines such as unused variables, unreachable code and syntax
* Bad, because the amount of development overhead could slow down the entire process of writing code if its incorporation into our project cannot be optimized
  
### Prettier

* Good, because this linter primary focus is on code formatting ensuring that code is presented in an elegant manner
* Bad, due to lack of configurability meaning that developers cannot configure individual formatting rules to match specific project or team preferences
* Bad,  because it has a strict rule of formatting rules meaning that developers have less freedom in deciding what convention they would like to choose
* Bad, because there exists a lot of complexity in incorporating Prettier into our coding project

## More Information

NA

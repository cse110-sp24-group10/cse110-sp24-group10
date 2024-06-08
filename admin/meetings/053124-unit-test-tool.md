# General Design Choices

## Context and Problem Statement

The team is currently implementing the JavaScript functionality across all 3 pages: calendar, task list, and journal. As we start coding, we need unit tests to make sure that our code works as intended and
future iteratiosn to the repo doesn't break the existing code base. The question we are tackling is which code testing tool should we use?

<!-- This is an optional element. Feel free to remove. -->
## Decision Drivers

* Should be accessible and easy to use for all team members
* Should be easy to learn since we are pressured for time

## Considered Options

* Mocha
* Jest

## Decision Outcome

Chosen option: Jest. Time is by far our biggest pressure, so we can really benefit from Jest's familiarity and easy/simple setup. Running in tests is convinient but not necessary. We don't need the extra
functionality or speed given by Mocha since our tests would be relatively simple

### Consequences

* Good, all team members are familiar with it already through working with it in the labs shown in class.
* Good, we have examples of simple setups via the labs shown in class.
* Good, because the setup is simpler than Mocha.
* Good, because tests can be run in parallel.
* Bad, because it has less flexibility and functionality than Mocha.
* Bad, because tests are slower than ones ran in Mocha.
* Bad, because no ESM support.

## Pros and Cons of the Options

### Mocha

* Good, because it supports testing for ESM.
* Good, because it runs faster than Jest (5x-40x faster)
* Bad, because team members aren't familiar with the tool.
* Bad, because the setup is more complicated.

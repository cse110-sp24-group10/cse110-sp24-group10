# Meeting Minutes For Team 10
## Meeting Information
**Meeting Date/Start Time:** 6/5/2024 3:00 PM

**Meeting End Time:** 4:30 PM

**Meeting Purpose:** Wrap up sprint 2 and start sprint 3 <be>

**Meeting Location:** Audrey's Cafe <br>

**Note Taker:** Michael Chen <br>

## Attendees
People who attended:
- Anthony Gonzalez
- Altair Aguelo
- Jonghun Lee
- Michael Chen
- Anish Devineni
- Pranav Prabu
- Asher Pothen James
  
## Absent
- Daris Chen
- Mingyang Sun
- Karinna Monzon

## Agenda Items

Item | Description
---- | ----
Sprint 2 retro and review
Start sprint 3

## Discussion Items
- Closed issues
  - Unified footer
  - Calendar footer
  - Implementing CodeMirror
  - Journal event listener firing twice
  - Calendar sizing
  - Saving journal data in localstorage
  - Saving text data in journals for every keystroke
  - Time since last saved in journal
  - Prev and next buttons on journal pages
- Sprint 2 review
  - Anish
    -  Working on Github Actions, issues, etc.
    -  Implemented and worked on CodeMirror in journal
  - Altair
    - Calendar popup
      - Exiting via x button or clicking out
      - Dynamically updating date
      - Pulling tasks and linking to task list
      - Button for journal page
    - Calendar unit tests
      - Basic functionality
        - Checking if date changes correctly when prev/next buttons for calendar and popup
      - Still work in progress
    - Created unified footer for calendar and implemented across all pages
      - Same design as journal footer since it looks like tabs of a folder
  - Pranav
    - Filter button
    - Fixed bugs with integration
      - Filter didn't work
      - Reloading messed up lowercase due to case changing
      - Linking color to rest of task list
    - Finished localstorage part
  - Asher
    - ADRs for CodeMirror version and linter
  - Anthony
    - Implementing intial footer
    - CSS variables and unifying design journal
      - Sizing elements 
    - Implementing codemirror
    - Implement journal localstorage and functionality
    - Mobile compatibility
  - Michael
    - Previous and next buttons for journal page
    - Initial implementation of pulling tasks and tags from task list
      - Still not done as task list local storage wasn't done at the time of writing
    - Rest is same as Anthony
- Sprint 2 Retro
  - Want to link pages together
  - Want to create unit tests
  - Put a stop on features unless we have extra time
- Sprint 3 Planning
  - Issues to work on
    - Unit tests for all pages
    - Unifying design choices between all pages
    - Implementing function between all pages
      - Get footer button for journal working properly
      - Pressing calendar day gives a link to the corresponding journal day
      - Started already
    - Task list 
      - Adding difficulty tag to task list
      - Implementing nameable tags with colors
      - Finish local storage
      - Finish filter/sort functionality
    - Calendar
      - Finish pulling tasks from task list
    - Potential features
      - Markdown previewer for text box in journal
      - Logo on all pages
      - Implementing coding joke API
      - Favicon
  - Work out planning for video, link sent in Slack
## To Do Later
- Issues Being Worked on
  - Importing tags and tasks for journal
  - Finishing unit test
- Issues to Start
  - Journal 
  - Turning journal textbox into markdown
  - Linking journal to calendar and reverse
  - Unit tests for journals
  - Sort and filter buttons for task list

## Other Notes & Information
- Asher work on ADR for how code is saved (new entry for each language)

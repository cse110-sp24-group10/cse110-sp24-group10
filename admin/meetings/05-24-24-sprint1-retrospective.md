# Meeting Minutes For Team 10
## Meeting Information
**Meeting Date/Start Time:** 5/24/24 12PM
**Meeting End Time:** 
**Meeting Purpose:** Sprint 1 Retrospective and Sprint 2 Startup
**Meeting Location:** Online/Zoom
**Note Taker:** Altair Aguelo/Anthony Gonzalez

## Attendees
People who attended:
(Move to Absent if they did not show up)
- Anthony Gonzalez
- Altair Aguelo
- Anish Devineni
- Daris Chen
- Michael Chen
- Mingyang Sun
- Pranav Prabu
- Asher Pothen James

## Absent

- Amey Kapare
- Jonghun Lee
- Karinna Monzon

## Agenda Items
- Sprint Review (Demo/Share)
- 
Item | Description
---- | ----
Sprint Review | • Task List Team <br>• Calendar Team <br>• Journal Team 
Sprint Retro | • Start Stop Continue
Action items | • General Team fixes <br>• Task List fixes <br>• Calendar Fixes <br>• Journal fixes

## Discussion Items
- Anish Review (Task List Team)
  - Reviewed/Closed Issues
  - Basic Functionality working
    - Add, Delete, Edit
    - Has time and date/mini calendar
    - Option to add tag/change color
    - Checkmark/Greyed out when done with task
    - tasks stored to local storage (delete not done from local storage)
    - Can filter by date, tag, name, difficulty
  - Documentation needs touch up (JSDoc formatting needed too)
  - Want emphasis for CSS design and UI changes for sprint 2
  - Want to add drag n drop next sprint
  - Want to edit tag creation, right now just color
- **Altair Review (Calendar)**
  - Basic HTML, CSS and JS almost done
    - Footer Bar which is going to be used?
    - task list used journal one
    - Structure for each month in CSS
      - Want to add more than 1 year
    - Type writer theme for text
    - Color pallete sent in projects
      - In Project
    - Days highlighted
      - Hover over the days are highlighted
      - Past month and next month grey'd out
    - Knows the day we are on, add circle to the day
    - Works for every month of 2024
  - *Want to add*
    - Each day is a clickable button
    - Each item is a list item
      - Tag list item as something so it can send a message to the console
    - Functionality
      - Want to make it pop up a window
  - Design wise want to scale the calendar up to get bigger
    - Right now kind of small
  - How do we implement pop-up functionality
    - Make them clickable
      - Adding pop-up is easy after that 
- **Michael Chen (Journal)**
  - Placeholder task list
    - List of tasks for current day in the task list?
      - Now that task list is in local storage just pull from there
  - Text and Code area
    - Able to switch before text and code
      - *Next sprint update to code mirror*
    - Text still persists
      - Add text to storage
        - Every 30 seconds add to local storage
          - Figure it out later
  - Arrow buttons at top
    - Does it go to last populated day or just next day no matter what
    - Add hover ability over the buttons and stuff
      - Add feedback for buttons changing cursor stuff
  - Empty space in top right and bottom
    - Maybe new features
  - Oval around button maybe want to add
    - like calendar feature
- Overall Design Choices
  - Text a little bigger
    - Add more whitespace to make less dense
    - Boxes to scale to size of text
  - Slim down elements to not take up the whole page
  - Same aspect ratio
  - Sentiment widget?
    - If there is space should add it
  - SAVING
    - Text
      - Save it like where you switch between days it will show you the notes you have for that day
      - Want text and code for ex May 16 to be saved for May 16
      - Create new object
        - text and code value and pull from there
      - If it's added to local storage
        - When click out of the text box it would save the entire date linked w text and code
      - Would pull from local storage for the date
      - Array of objects w date text and code values
  - Add sentiment widget to the page given the space available
    - Maybe do in 3rd sprint since low priority

### (Sprint Retro)[https://easyretro.io/publicboard/4FePVeXvAbbBRMGXEIX89HI7Vlq2/91cc4643-6aee-4788-8e02-ff74e6f563aa]
- Start
  - unit tests
    - easiest done when writing code
    - write them as writing javascript
    - how do we do with local storage stuff?
      - It should be fine w testing locally
  - dev journal task list
  - better scheduling w meeting time
    - tough w classes and stuff
  - JSDOC documentation
    - Meeting to talk about pipeline
    - JSDOC and linting not really used
  - meeting seperately per team
  - popep on click of day design -> code
  - merging code
  - logo
- Stop
  - Writing code without comments/documentation
- Continue
  - Adding documentation
  - Tweaking desing choices
  - Teamwork
  - Same teams
    - Due to time crunch
  - Meeting at least once a week
  - Adding issues to document work points
- Take time to meet up together to make sure everything works at once
- Idea of dev hours
  - Set a time up (tenative wednesday) to just have a room or something to come in and work
    - Able to talk about integration


### Action items for sprint 2
- Unit test
- Adding functionality
  - Make it all work together
- Making it look good
  - Finalize design choices
  - Syncing all page with design
  - Logo
- Calendar
  - Click pop-up
    - Linking to other pages and tabs
    - Finalizing layout of the window
  - Yearly (updates for every year)
- Task List
  - Add difficulty
  - Local storage
    - Work with other teams to figure out structure of storage
  - Filter buttons/sort button
  - Fixing the design to
  - Let user type tag names instead of colors
    - Choose a name and color
- Journal
  - CodeMirror to the code snippet feature
    - Look more into CodeMirror
      - Decide which languages to support
      - Make the most use of it (They prolly have cool stuff we can use)
  - Pulling task from task list
  - Reusing the same code for the tags from the tasklist
  - Saving the text and code for each day
    - Autosave when you
    - Last saved popup
  - Resizing the elements and matching the theme of others
    - Bubble outsie of the next and previous button
    - Cursor pointer


  
## Decisions Made
| Reasoning | Item | Responsible |
| ---- | ---- | ---- |
| | item | who | 

## To Do Later
| Done? | Item | Responsible | Due Date |
| ---- | ---- | ---- | ---- |
| | item | Anthony | due_date |
| | item | Altair | due_date |
| | item | Amey | due_date |
| | item | Anish | due_date |
| | item | Asher | due_date |
| | item | Daris | due_date |
| | item | Jonghun | due_date |
| | item | Karinna | due_date |
| | item | Michael | due_date |
| | item | Mingyang | due_date |
| | item | Pranav | due_date |

## Other Notes & Information
N/A

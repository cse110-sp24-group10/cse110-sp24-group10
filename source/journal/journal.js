document.addEventListener('DOMContentLoaded', (event) => {
    let currDate;
    let currDay;
    let currMonth;
    let currYear;
    let currNumDays;
    let currDateFormatted;
    const currDateStr = localStorage.getItem("selectedDate");

    if (!currDateStr) {
        currDate = new Date();
    } else {
        currDate = new Date(JSON.parse(currDateStr));
    }

    currDay = currDate.getDate();
    currMonth = currDate.getMonth();
    currYear = currDate.getFullYear();
    currNumDays = new Date(currYear, currMonth + 1, 0).getDate();
    currDateFormatted = currMonth + 1 + '/' + currDay + '/' + currYear;

    // Create a CodeMirror instance with additional features
    const editor = CodeMirror(document.getElementById('editor'), {
        value: getStartingComment(document.getElementById('languageSelect').value),
        mode: document.getElementById('languageSelect').value,
        lineNumbers: true,
        theme: "default",
        autofocus: true,
        autoCloseBrackets: true,
        autoCloseTags: true,
        matchBrackets: true,
        scrollbarStyle: "native",
        styleActiveLine: { nonEmpty: true },
    });

    function loadTags() {
        const localTags = localStorage.getItem('tags');
        const parsedTags = JSON.parse(localTags);
        let localTasks = localStorage.getItem('tasks');
        let parsedLocalTasks = JSON.parse(localTasks);
        let seenTags = new Set();
        if (!parsedTags) {
            return;
        }

        parsedLocalTasks.forEach(task => {
            // adjust for timezone offset of task.date to make sure it isnt a day behind (task.date being 2024-06-07 should evaluate to june 7th, not 6th) and make sure the time is 0
            const taskDate = new Date(task.date);
            const adjustedTaskDate = new Date(taskDate.getTime() + taskDate.getTimezoneOffset() * 60000);
            const adjustedTaskDateFormatted = adjustedTaskDate.getMonth() + 1 + '/' + adjustedTaskDate.getDate() + '/' + adjustedTaskDate.getFullYear();
            if (adjustedTaskDateFormatted != currDateFormatted) {
                console.log(adjustedTaskDateFormatted);
                console.log(currDateFormatted);
                console.log("WRONG DATE");
                // leave the loop defined at line 46
                return;
            }
            if (!seenTags.has(task.name)) {
                seenTags.add(task.tag);
                const currTag = document.createElement('span');
                currTag.className = 'tag';
                parsedTags.forEach(tag => {
                    if (task.tag === tag.name) {
                        currTag.textContent = tag.name;
                        currTag.style.backgroundColor = tag.color;
                        document.getElementById('tags').appendChild(currTag);
                    }
                });
            }
        });
    }

    function loadTasks() {
        let localTasks = localStorage.getItem('tasks');
        let parsedLocalTasks = JSON.parse(localTasks);
        let htmlTasks = document.getElementById("task-list");

        parsedLocalTasks.forEach(task => {
            // adjust for timezone offset of task.date to make sure it isnt a day behind (task.date being 2024-06-07 should evaluate to june 7th, not 6th) and make sure the time is 0
            const taskDate = new Date(task.date);
            const adjustedTaskDate = new Date(taskDate.getTime() + taskDate.getTimezoneOffset() * 60000);
            const adjustedTaskDateFormatted = adjustedTaskDate.getMonth() + 1 + '/' + adjustedTaskDate.getDate() + '/' + adjustedTaskDate.getFullYear();

            if (adjustedTaskDateFormatted != currDateFormatted) {
                console.log(adjustedTaskDateFormatted);
                console.log(currDateFormatted);
                console.log("WRONG DATE");
                // leave the loop defined at line 46
                return;
            }

            const taskElement = createTaskElement(task);
            if (task.tag !== '') {
                taskElement.classList.add(task.tag.toLowerCase());
            }
            if (task.completed) {
                taskElement.classList.add('completed');
            }
            htmlTasks.appendChild(taskElement);
        });
    }

    function createTaskElement(task) {
        let localTasks = localStorage.getItem('tasks');
        let parsedLocalTasks = JSON.parse(localTasks);

        const li = document.createElement('li');
        li.className = 'task-item';

        const taskTagAndName = document.createElement('span');
        taskTagAndName.className = 'task-name';
        taskTagAndName.textContent = `[${task.tag}] - ${task.name}`;
        
        if (task.completed === true) {
            li.classList.add('completed');
        }

        const checkbox = document.createElement('input');
        checkbox.checked = task.completed;
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed');
            if (checkbox.checked) {
                li.classList.add('completed');
                // look for the task in localstorage and change the completed value to true and rewrite back to localstorage
                parsedLocalTasks.forEach(localTask => {
                    console.log(task.name + " vs " + localTask.name);
                    if (task.name === localTask.name) {
                        localTask.completed = true;
                    }
                });
                
            } else {
                li.classList.remove('completed');
                parsedLocalTasks.forEach(localTask => {
                    if (task.name === localTask.name) {
                        localTask.completed = false;
                    }
                });
            }

            localStorage.setItem('tasks', JSON.stringify(parsedLocalTasks));
        });
        
        const taskDiff = document.createElement('div');
        taskDiff.className = 'task-diff';
        if(task.difficulty === "blue") {
            taskDiff.textContent = "Very Easy";
        } else if(task.difficulty === "green") {
            taskDiff.textContent = "Easy";
        } else if(task.difficulty === "yellow") {
            taskDiff.textContent = "Medium";
        } else if(task.difficulty === "orange") {
            taskDiff.textContent = "Hard";
        } else if (task.difficulty === "red") {
            taskDiff.textContent = "Very Hard";
        } else {
            taskDiff.textContent = "None";
        }

        const taskTime = document.createElement('input');
        taskTime.type = 'time';
        taskTime.className = 'task-time';
        taskTime.value = task.time;
        taskTime.disabled = true;

        li.appendChild(checkbox);
        li.appendChild(taskTagAndName);
        
        li.append(taskDiff);
        li.append(taskTime);
        
        return li;
        
    }

    function loadTexts() {
        const localJournal = localStorage.getItem('journal');
        const parsedJournal = JSON.parse(localJournal);
        const language = document.getElementById('languageSelect').value;

        // Check if current day currently exists in localstorage
        if (!parsedJournal || !parsedJournal[currDateFormatted]) {
            editor.getDoc().setValue(getStartingComment(language));
            return;
        }

        document.getElementById('textBox').value = parsedJournal[currDateFormatted]["textValue"];
        if (language === 'python') {
            editor.getDoc().setValue(parsedJournal[currDateFormatted]["pythonCode"] || getStartingComment(language));
        } else if (language === 'javascript') {
            editor.getDoc().setValue(parsedJournal[currDateFormatted]["javascriptCode"] || getStartingComment(language));
        } else if (language === 'text/x-c++src') {
            editor.getDoc().setValue(parsedJournal[currDateFormatted]["cplusplusCode"] || getStartingComment(language));
        }

        // Load the last saved time from local storage
        const lastSaved = parsedJournal[currDateFormatted]["lastSaved"];
        if (lastSaved) {
            const lastSavedElement = document.getElementById('lastSaved');
            lastSavedElement.textContent = `Last Saved: ${lastSaved}`;
        }
    }


    /*
        FORMAT OF JOURNAL DATA IN LOCALSTORAGE
        journal: {
            date1: {
                textValue: string,
                pythonCode: string,
                javascriptCode: string,
                c++Code: string
            
            date2: { 
                textValue: string,
                pythonCode: string,
                javascriptCode: string,
                c++Code: string
            }

        }
        */
    function saveToLocalStorage() {
        const textVal = document.getElementById('textBox').value;
        let allJournalData = JSON.parse(localStorage.getItem('journal') || '{}'); // Initialize as an object
        const language = document.getElementById('languageSelect').value;
        const editorValue = editor.getValue();

        // If the current date does not exist in the journal data, initialize it
        if (!allJournalData[currDateFormatted]) {
            allJournalData[currDateFormatted] = {
                textValue: "",
                pythonCode: "",
                javascriptCode: "",
                cplusplusCode: ""
            };
        }

        // Update the text value and the code for the currently selected language
        allJournalData[currDateFormatted].textValue = textVal;
        if (language === 'python') {
            allJournalData[currDateFormatted].pythonCode = editorValue;
        } else if (language === 'javascript') {
            allJournalData[currDateFormatted].javascriptCode = editorValue;
        } else if (language === 'text/x-c++src') {
            allJournalData[currDateFormatted].cplusplusCode = editorValue;
        }

        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); // Format time in 12-hour format with AM/PM
        allJournalData[currDateFormatted].lastSaved = now.toLocaleDateString() + " " + timeString;

        localStorage.setItem('journal', JSON.stringify(allJournalData)); // Save new journal object to localstorage
        const lastSaved = document.getElementById('lastSaved');
        lastSaved.textContent = `Last Saved: ${timeString}`;
    }

    function updateDateText() {
        const htmlDate = document.getElementById('date'); // date in HTML, the one shown on the page
        const currDateString = currDate.toDateString();
        htmlDate.textContent = currDateString;
    }


    // TODO: COMBINE LOADTAGS() AND LOADTASKS() HERE
    function populatePage() {
        const allJournalData = localStorage.getItem('journal');

        updateDateText();
        // TODO: default all texts before repopulating
        document.getElementById('textBox').value = '';
        editor.getDoc().setValue('// Enter code here');

        // deleting all tags and tasks before repopulating to make sure data doesn't bleed over into next pages
        document.getElementById('tags').innerHTML = '<h2>Tags:</h2>';
        document.getElementById('tasks').innerHTML = `<h2>Tasks:</h2><div class="task-list-container">
        <div class="sortable-list">
        <ul id="task-list"><!-- Task items will be appended here -->
        </ul>
        </div>
        </div>`;
        loadTags();
        loadTasks();
        loadTexts();
    }

    populatePage();

    // Event listener for codeButton to switch to code editor
    document.getElementById('codeButton').addEventListener('click', function () {
        document.getElementById('languageSelect').style.display = 'inline-block';
        document.getElementById('themeSelect').style.display = 'inline-block';
        this.classList.add('active');
        document.getElementById('textButton').classList.remove('active');
        document.getElementById('editor').classList.add('active');
        editor.refresh(); // Refresh CodeMirror when it becomes visible
        document.getElementById('textBox').classList.remove('active');
    });

    // Event listener for textButton to switch to text textarea
    document.getElementById('textButton').addEventListener('click', function () {
        document.getElementById('languageSelect').style.display = 'none';
        document.getElementById('themeSelect').style.display = 'none';
        this.classList.add('active');
        document.getElementById('codeButton').classList.remove('active');
        document.getElementById('textBox').classList.add('active');
        document.getElementById('editor').classList.remove('active');
    });

    function getStartingComment(language) {
        switch (language) {
            case 'javascript':
                return '// Enter code here\n';
            case 'python':
                return '# Enter code here\n';
            case 'text/x-c++src':
                return '// Enter code here\n';
            default:
                return '';
        }
    }

    document.getElementById('languageSelect').addEventListener('change', function () {
        editor.setOption('mode', this.value);
        editor.getDoc().setValue(getStartingComment(this.value));
        loadTexts();
    });

    document.getElementById('themeSelect').addEventListener('change', function () {
        editor.setOption('theme', this.value);

        // Define the active line colors for each theme
        const activeLineColors = {
            default: '#F6EEE3',
            monokai: '#49483E',
            eclipse: '#E8F2FE',
            // Add more themes as needed
        };

        // Get the active line color for the current theme
        const activeLineColor = activeLineColors[this.value];

        // Create a new style tag
        const style = document.createElement('style');
        style.textContent = `
            .CodeMirror-activeline .CodeMirror-line {
                background: ${activeLineColor} !important;
            }`;

        // Remove the old style tag, if it exists
        const oldStyle = document.getElementById('active-line-style');
        if (oldStyle) {
            oldStyle.remove();
        }

        // Add an id to the new style tag and append it to the document head
        style.id = 'active-line-style';
        document.head.appendChild(style);
    });

    document.getElementById('left-arrow').addEventListener('click', function () {
        //saveToLocalStorage();
        // decrement date by 1. check for month and year changes and adjust variables accordingly
        currDay--;
        if (currDay === 0) {
            currMonth--;
            if (currMonth === -1) {
                currYear--;
                currMonth = 11;
            }
            currDay = new Date(currYear, currMonth + 1, 0).getDate();
        }
        currDate = new Date(currYear, currMonth, currDay);
        currDateFormatted = currMonth + 1 + '/' + currDay + '/' + currYear; 

        updateDateText();
        populatePage();
    });


    document.getElementById('right-arrow').addEventListener('click', function () {
        // increment date by 1. check for month and year changes and adjust variables accordingly
        currDay++;
        if (currDay > currNumDays) {
            currMonth++;
            if (currMonth === 12) {
                currYear++;
                currMonth = 0;
            }
            currDay = 1;
        }
        currDate = new Date(currYear, currMonth, currDay);
        currDateFormatted = currMonth + 1 + '/' + currDay + '/' + currYear;

        updateDateText();
        populatePage();
    });

    document.getElementById('textBox').addEventListener('keyup', saveToLocalStorage);

    document.getElementById('editor').addEventListener('keyup', saveToLocalStorage);
});
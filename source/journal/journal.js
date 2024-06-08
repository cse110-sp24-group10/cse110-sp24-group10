document.addEventListener('DOMContentLoaded', (event) => {
    let taskList = document.getElementById('task-list');
    console.log(taskList);
    let currDate;
    let currDay;
    let currMonth;
    let currYear;
    let currNumDays;
    let currDateFormatted;
    const selectedDateStr = localStorage.getItem("selectedDate");

    if (!selectedDateStr) {
        currDate = new Date();
    } else {
        currDate = new Date(JSON.parse(selectedDateStr));
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

        // TODO: IMPLEMENT IMPORTING ONLY TASKS THAT HAVE CURRENT DATE
        // Check if there is any data in tags
        if (!parsedTags) {
            return;
        }

        parsedTags.forEach(task => {
            const currTag = document.createElement('span');
            currTag.className = 'tag ' + task.tag; // tags are currently implemented as tag.<color>
            currTag.textContent = task.tag;
            document.getElementById('tags').appendChild(currTag);
        });
    }

    function saveTasks() {
        const tasks = Array.from(taskList.children).map(task => {
            return {
                name: task.querySelector('.task-name').textContent,
                completed: task.querySelector('input[type="checkbox"]').checked,
                date: task.querySelector('.task-date-input').value,
                time: task.querySelector('.task-time-input').value,
                difficulty: task.querySelector('.task-difficulty select').value,
                tag: task.querySelector('.task-tag select').value
            };
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        console.log(taskList);
        Array.from(taskList.children).forEach(task => {
            const taskElement = createTaskElement(task.name, task.completed, task.date, task.time, task.tag);
            if (task.tag !== '') {
                taskElement.classList.add(task.tag.toLowerCase());
            }
            if (task.completed) {
                taskElement.classList.add('completed');
            }
            taskList.appendChild(taskElement);
        });
    }

    function createTaskElement(name = 'New Task', completed = false, date = '', time = '', difficulty = '', tag = '') {
        const li = document.createElement('li');
        li.className = 'task-item';

        const taskName = document.createElement('span');
        taskName.className = 'task-name';
        taskName.textContent = name;

        if (completed) {
            li.classList.add('completed');
        }

        const checkbox = document.createElement('input');
        checkbox.checked = completed;
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed');
            if (!task.completed) {
                task.completed = true;
                task.innerHTML = '<s>' + task.innerText + '</s>';
            } else {
                task.completed = false;
                task.innerHTML = task.innerText.replace('<s>', '').replace('</s>', '');
            }

            saveTasks();
        });

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.className = 'task-date-input';
        dateInput.value = date;
        dateInput.disabled = true;

        const taskDateTime = document.createElement('div');
        taskDateTime.className = 'task-date-time';

        const timeInput = document.createElement('input');
        timeInput.type = 'time';
        timeInput.className = 'task-time-input';
        timeInput.value = time;
        timeInput.disabled = true;

        taskDateTime.appendChild(dateInput);
        taskDateTime.appendChild(timeInput);

        const taskDiff = document.createElement('div');
        taskDiff.className = 'task-difficulty';
        taskDiff.textContent = difficulty;
        /*
        const taskCategory = document.createElement('div');
        taskCategory.className = 'task-category';
        const categorySpan = document.createElement('span');
        categorySpan.textContent = tag;
        taskCategory.appendChild(categorySpan);
        */

        li.appendChild(checkbox);
        li.appendChild(taskName);
        li.appendChild(taskCategory);
        li.appendChild(taskDateTime);

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
                textValue: "text1",
                pythonCode: "code python",
                javascriptCode: "code javascript"
                c++Code: "code c++"
            }
            
            date2: { 
                textValue: "text2",
                pythonCode: "code python",
                javascriptCode: "code javascript"
                c++Code: "code c++"
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
        /*
        document.getElementById('tasks').innerHTML = `<h2>Tasks:</h2><div class="task-list-container">
        <div class="sortable-list">
        <ul id="task-list"><!-- Task items will be appended here -->
        </ul>
        </div>
        </div>`;
        */
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

    document.getElementById('settings').addEventListener('click', function () {
        saveToLocalStorage();
    });

    document.getElementById('textBox').addEventListener('keyup', saveToLocalStorage);

    document.getElementById('editor').addEventListener('keyup', saveToLocalStorage);
});
document.addEventListener('DOMContentLoaded', (event) => {
    let currDate = new Date();
    let currDay = currDate.getDate();
    let currMonth = currDate.getMonth();
    let currYear = currDate.getFullYear();
    let currNumDays = new Date(currYear, currMonth + 1, 0).getDate();

    // Create a CodeMirror instance with additional features
    const editor = CodeMirror(document.getElementById('editor'), {
        value: "// Enter code here\n",
        mode: "javascript",
        lineNumbers: true,
        theme: "default",
        autofocus: true,
        autoCloseBrackets: true,
        autoCloseTags: true,
        matchBrackets: true,
        scrollbarStyle: "native"
    });

    function loadTags() {
        const localStorageData = localStorage.getItem('tasks');
        const parsedData = JSON.parse(localStorageData);
        
        // TODO: IMPLEMENT IMPORTING ONLY TASKS THAT HAVE CURRENT DATE
        // Check if there is any data in tags
        if (!parsedData) {
            return;
        }

        parsedData.forEach(task => {
            const currTag = document.createElement('span');
            currTag.className = 'tag ' + task.tag; // tags are currently implemented as tag.<color>
            currTag.textContent = task.tag;
            document.getElementById('tags').appendChild(currTag);
        });
    }
    
    // TODO: FINISH WHEN TASK LIST IS DONE ON THE LOCAL STORAGE PART
    function loadTasks() {
        let localStorageData = localStorage.getItem('tasks');
        let parsedData = JSON.parse(localStorageData);

        // Check if there are any tasks
        if(!parsedData) {
            return;
        }

        parsedData.forEach(item => {
            const currTask = document.createElement('div');
            currTask.className = 'task';
            currTask.textContet = item.task;
        });
    }


    
    function saveToLocalStorage() {
        let textVal = document.getElementById('textBox').value;
        console.log("TEXTBOXVAL = " + textVal);
        console.log("EDITORVAL = " + editor.getValue());

        const currData = {
            date: currDate.toDateString(),
            data: {
                textValue: document.getElementById('textBox').value,
                editorValue: editor.getValue(),
            }
        };

        console.log(currData);

        localStorage.setItem('journal', JSON.stringify(currData));
    }

    function updateDateText() {
        const htmlDate = document.getElementById('date'); // date in HTML, the one shown on the page
        const currDateString = currDate.toDateString();
        htmlDate.textContent  = currDateString;
    }

    
    // TODO: COMBINE LOADTAGS() AND LOADTASKS() HERE
    function populatePage() {
        const allJournalData = localStorage.getItem('journal');

        updateDateText();
        // deleting all tags and tasks before repopulating to make sure data doesn't bleed over into next pages
        document.getElementById('tags').innerHTML = '<h2>Tags:</h2>';
        document.getElementById('tasks').innerHTML = '<h2>Tasks:</h2>';
        loadTags();
        loadTasks();

        
        console.log(allJournalData);
        // if there is theres no journal data in localstorage, initialize an empty array for it
        if (!allJournalData) {
            localStorage.setItem('journal', JSON.stringify([]));
            return;
        }

        let parsedData = JSON.parse(allJournalData);
        console.log(typeof(parsedData));
        /*
        parsedData.forEach(entry => {
            if (entry.date === currDate.toDateString()) {
                document.getElementById('textBox').value = entry.data.textValue;
                editor.setValue(entry.data.editorValue);
            }
        });
        */
        
    }
    populatePage();

    // Event listener for codeButton to switch to code editor
    document.getElementById('codeButton').addEventListener('click', function() {
        document.getElementById('editor').classList.add('active');
        editor.refresh(); // Refresh CodeMirror when it becomes visible
        document.getElementById('textBox').classList.remove('active');
    });

    // Event listener for textButton to switch to text textarea
    document.getElementById('textButton').addEventListener('click', function() {
        document.getElementById('textBox').classList.add('active');
        document.getElementById('editor').classList.remove('active');
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
        
        updateDateText();
        populatePage();
    });

    document.getElementById('settings').addEventListener('click', function () {
        console.log('SETTINGS CLICKED');
    });
});

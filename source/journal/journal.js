document.addEventListener('DOMContentLoaded', (event) => {
    let currDate = new Date();
    let currDay = currDate.getDate();
    let currMonth = currDate.getMonth();
    let currYear = currDate.getFullYear();
    let currNumDays = new Date(currYear, currMonth + 1, 0).getDate();
    let currDateFormatted = currMonth + 1 + '/' + currDay + '/' + currYear;

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
        const localTags = localStorage.getItem('tags');
        const parsedTags = JSON.parse(localTags);
        
        // TODO: IMPLEMENT IMPORTING ONLY TASKS THAT HAVE CURRENT DATE
        // Check if there is any data in tags
        if (!parsedTags) {
            return;
        }

        parsedTasks.forEach(task => {
            const currTag = document.createElement('span');
            currTag.className = 'tag ' + task.tag; // tags are currently implemented as tag.<color>
            currTag.textContent = task.tag;
            document.getElementById('tags').appendChild(currTag);
        });
    }
    
    // TODO: FINISH WHEN TASK LIST IS DONE ON THE LOCAL STORAGE PART
    function loadTasks() {
        let localTasks = localStorage.getItem('tasks');
        let parsedTasks = JSON.parse(localTasks);

        // Check if there are any tasks
        if(!parsedTasks) {
            return;
        }

        parsedTasks.forEach(item => {
            const currTask = document.createElement('div');
            currTask.className = 'task';
            currTask.textContet = item.task;
        });
    }

    function loadTexts() {
        const localJournal = localStorage.getItem('journal');
        const parsedJournal = JSON.parse(localJournal);
        
        // Check if current day currently exists in localstorage
        if (!parsedJournal[currDateFormatted]) {
            return;
        }

        document.getElementById('textBox').value = parsedJournal[currDateFormatted]["textValue"];
        editor.getDoc().setValue(parsedJournal[currDateFormatted]["editorValue"]);
    }

    
    function saveToLocalStorage() {
        /*
        FORMAT OF JOURNAL DATA IN LOCALSTORAGE
        journal: {
            date1: {
                textValue: "text1",
                editorValue: "editor1"
            }
            
            date2: { 
                textValue: "text2",
                editorValue: "editor2"
            }

        }
        */
        const textVal = document.getElementById('textBox').value;
        let allJournalData = JSON.parse(localStorage.getItem('journal') || '[]'); // get the journal array from localstorage if there is no journal array then it will create 
        const currData = {
            textValue: document.getElementById('textBox').value,
            editorValue: editor.getValue(),
        };
        
        allJournalData[currDateFormatted] = currData; // append currData to journal array

        localStorage.setItem('journal', JSON.stringify(allJournalData)); // save new journal object to localstorage
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
        // TODO: default all texts before repopulating
        document.getElementById('textBox').value = '';
        editor.getDoc().setValue('// Enter code here');

        // deleting all tags and tasks before repopulating to make sure data doesn't bleed over into next pages
        document.getElementById('tags').innerHTML = '<h2>Tags:</h2>';
        document.getElementById('tasks').innerHTML = '<h2>Tasks:</h2>';
        loadTags();
        loadTasks();
        loadTexts();
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
        console.log('SETTINGS CLICKED');
        saveToLocalStorage();
    });

    document.getElementById('textBox').addEventListener('keyup', saveToLocalStorage);

    document.getElementById('editor').addEventListener('keyup', saveToLocalStorage);
});

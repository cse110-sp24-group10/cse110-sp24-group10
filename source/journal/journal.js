document.addEventListener('DOMContentLoaded', (event) => {
    function loadTags() {
        const localStorageData = localStorage.getItem('tasks');
        const parsedData = JSON.parse(localStorageData);
        
        parsedData.forEach(item => {
            const currTag = document.createElement('span');
            currTag.className = 'tag ' + item.tag;
            currTag.textContent = item.tag;
            document.getElementById('tags').appendChild(currTag);
        });
    }

    loadTags();
    
    function loadTasks() {
        let localStorageData = localStorage.getItem('tasks');
        let parsedData = JSON.parse(localStorageData);
        console.log(parsedData);
        parsedData.forEach(item => {
            const currTask = document.createElement('div');
            currTask.className = 'task';
            currTask.textContet = item.task;
        });
    }

    loadTasks();
    // Create a CodeMirror instance with additional features
    const editor = CodeMirror(document.getElementById('editor'), {
        value: "function myScript(){return 100;}\n",
        mode: "javascript",
        lineNumbers: true,
        theme: "default",
        autofocus: true,
        autoCloseBrackets: true,
        autoCloseTags: true,
        matchBrackets: true,
        scrollbarStyle: "native"
    });
    
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
        console.log('LEFT ARROW CLICKED');
    });

    document.getElementById('right-arrow').addEventListener('click', function () {
        console.log('RIGHT ARROW CLICKED');
    });

    document.getElementById('settings').addEventListener('click', function () {
        console.log('SETTINGS CLICKED');
    });
});

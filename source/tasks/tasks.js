document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const filterBtn = document.getElementById('filter-btn');
    const sidebar = document.querySelector('.sidebar');
    const closeBtn = document.getElementById('close-sidebar');

    /**
     * Saves tasks to local storage.
     * Each task is an object with a name and a completed status.
     */
    function saveTasksToLocalStorage() {
        const tasks = Array.from(taskList.children).map(task => {
            return {
                name: task.querySelector('.task-name').textContent,
                completed: task.querySelector('input[type="checkbox"]').checked,
                date: task.querySelector('.task-date-input').value,
                time: task.querySelector('.task-time-input').value,
                tag: task.querySelector('.task-category select').value

            };
        });
    
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    /**
     * Loads tasks from local storage and adds them to the task list.
     * Each task is an object with a name and a completed status.
     */
    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
        tasks.forEach(task => {
            const taskElement = createTaskElement(task.name, task.completed, task.date, task.time, task.tag);
            taskElement.classList.add(task.tag);
            taskList.insertBefore(taskElement, taskList.firstChild);
        });
    }
    
    loadTasksFromLocalStorage();
    
    filterBtn.addEventListener('click', () => {
        sidebar.classList.toggle('show-sidebar');
    });
    
    closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('show-sidebar');
    });
    
    // Button to add task
    addTaskBtn.addEventListener('click', () => {
        const newTask = createTaskElement();
        taskList.insertBefore(newTask, taskList.firstChild);

        // storage
        saveTasksToLocalStorage();
    });

    //Task element
    function createTaskElement(name = 'New Task', completed = false, date = '', time = '', tag = '') {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.draggable = "true";

        const checkbox = document.createElement('input');
        checkbox.checked = completed;
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed');

            //storage
            saveTasksToLocalStorage();
        });

        const taskColor = document.createElement('div');
        taskColor.className = 'task-color';
        taskColor.style.backgroundColor = tag;

        const taskName = document.createElement('span');
        taskName.className = 'task-name';
        taskName.contentEditable = true;
        taskName.textContent = 'New Task';
        taskName.textContent = name;

        taskName.addEventListener('mouseover', () => {
            taskName.style.color = '#333';
        });

        taskName.addEventListener('mouseout', () => {
            taskName.style.color = '';
        });

        

        //Add color category
        const taskCategory = document.createElement('div');
        taskCategory.className = 'task-category';
        const categorySelect = document.createElement('select');
        ['Red', 'Yellow', 'Green', 'Blue', 'Purple'].forEach(color => {
            const option = document.createElement('option');
            option.value = color.toLowerCase();
            option.textContent = color;
            categorySelect.appendChild(option);
        });
        taskCategory.appendChild(categorySelect);

        categorySelect.addEventListener('change', () => {
            taskColor.style.backgroundColor = categorySelect.value;
            li.classList.remove('red', 'yellow', 'green', 'blue', 'purple'); // Remove existing color class
            li.classList.add(categorySelect.value); // Add color class to task item
            categorySelect.style.display = 'none';

            // Save tasks to local storage after updating the select element's value
            saveTasksToLocalStorage();
        });

        categorySelect.value = tag;

        taskCategory.addEventListener('click', () => {
            categorySelect.style.display = 'block';
        });
        
        const colorTagBtn = document.createElement('button');
        colorTagBtn.className = 'color-tag-btn';
        colorTagBtn.textContent = 'Add Tag';
        colorTagBtn.addEventListener('click', () => {
            taskCategory.click();
        });
        
        // New date and time picker code
        const taskDateTime = document.createElement('div');
        taskDateTime.className = 'task-date-time';

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.className = 'task-date-input';

        const timeInput = document.createElement('input');
        timeInput.type = 'time';
        timeInput.className = 'task-time-input';

        dateInput.value = date;
        timeInput.value = time;

        taskDateTime.appendChild(dateInput);
        taskDateTime.appendChild(timeInput);

        dateInput.addEventListener('focus', () => {
            dateInput.style.display = 'block';
        });

        timeInput.addEventListener('focus', () => {
            timeInput.style.display = 'block';
        });


        const reorderBtn = document.createElement('button');
        reorderBtn.className = 'reorder-btn';
        reorderBtn.textContent = '\u22EE';

        reorderBtn.addEventListener('mousedown', (e) => {
            li.draggable = true;
            li.classList.add('dragging');
        });

        reorderBtn.addEventListener('mouseup', (e) => {
            li.draggable = false;
            li.classList.remove('dragging');
        });
        

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'X';
        deleteBtn.addEventListener('click', () => {
            li.remove();
        });

        li.appendChild(checkbox);
        li.appendChild(taskColor);
        li.appendChild(taskName);
        li.appendChild(taskCategory);
        li.appendChild(taskDateTime);

        li.appendChild(colorTagBtn);
        li.appendChild(reorderBtn);
        li.appendChild(deleteBtn);

        return li;
    }

    let draggedItem = null;
 
    taskList.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('dragging')) {
            draggedItem = e.target;
            setTimeout(() => {
                e.target.style.display = 'none';
            }, 0);
        }
    });
    
    taskList.addEventListener('dragend', (e) => {
        setTimeout(() => {
            e.target.style.display = '';
            draggedItem = null;
        }, 0);
        e.target.classList.remove('dragging');
        e.target.draggable = false; // Reset draggable to false
    });
    
    taskList.addEventListener(
        "dragover",
        (e) => {
            e.preventDefault();
            const afterElement =
                getDragAfterElement(
                    taskList,
                    e.clientY);
            const currentElement =
                document.querySelector(
                    ".dragging");
            if (afterElement == null) {
                taskList.appendChild(
                    draggedItem
                );} 
            else {
                taskList.insertBefore(
                    draggedItem,
                    afterElement
                );}
        });
    
    const getDragAfterElement = (
        container, y
    ) => {
        const draggableElements = [
            ...container.querySelectorAll(
                "li:not(.dragging)"
            ),];
    
        return draggableElements.reduce(
            (closest, child) => {
                const box =
                    child.getBoundingClientRect();
                const offset =
                    y - box.top - box.height / 2;
                if (
                    offset < 0 &&
                    offset > closest.offset) {
                    return {
                        offset: offset,
                        element: child,
                    };} 
                else {
                    return closest;
                }},
            {
                offset: Number.NEGATIVE_INFINITY,
            }
        ).element;
    };

});


const filterBtn = document.getElementById('filter-btn');

function sortTasksByName() {
    // Get all tasks
    const tasks = document.querySelectorAll('.task-item');
    const tasksArray = Array.from(tasks);

    // Sort array based on the names of the tasks
    tasksArray.sort((a, b) => {
        const nameA = a.querySelector('.task-name').textContent;
        const nameB = b.querySelector('.task-name').textContent;

        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    // Remove all tasks from the DOM
    tasks.forEach(task => task.parentNode.removeChild(task));

    // Append sorted tasks back to the DOM
    const taskList = document.getElementById('task-list');
    tasksArray.forEach(task => taskList.appendChild(task));
}

function sortTasksByDate() {
    // Get all tasks
    const tasks = document.querySelectorAll('.task-item');
    const tasksArray = Array.from(tasks);

    // Sort array based on the dates of the tasks
    tasksArray.sort((a, b) => {
        const dateA = new Date(a.querySelector('.task-date-input').value);
        const dateB = new Date(b.querySelector('.task-date-input').value);

        // If the dates are the same, sort by time
        if (dateA.getTime() === dateB.getTime()) {
            const timeA = a.querySelector('.task-time-input').value;
            const timeB = b.querySelector('.task-time-input').value;

            return timeA < timeB ? -1 : (timeA > timeB ? 1 : 0);
        }

        return dateA - dateB;
    });

    // Remove all tasks from the DOM
    tasks.forEach(task => task.parentNode.removeChild(task));

    // Append sorted tasks back to the DOM
    const taskList = document.getElementById('task-list');
    tasksArray.forEach(task => taskList.appendChild(task));
}

// Get the buttons
const dateFilterBtn = document.getElementById('date-filter');
const nameFilterBtn = document.getElementById('name-filter');

// Add event listeners
dateFilterBtn.addEventListener('click', sortTasksByDate);
nameFilterBtn.addEventListener('click', sortTasksByName);
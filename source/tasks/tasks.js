document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const filterBtn = document.getElementById('filter-btn');
    const sidebar = document.querySelector('.sidebar');
    const closeBtn = document.getElementById('close-sidebar');
    const bottomBar = document.querySelector('bottom-bar');

    // Check local storage to keep the dark mode setting consistent across sessions
    if (localStorage.getItem("darkMode") === "enabled") {
        darkModeToggle.checked = true;
        body.classList.add("dark-mode");
    }

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

    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskElement = createTaskElement(task.name, task.completed, task.date, task.time, task.tag);
            if (task.tag !== '') {
                taskElement.classList.add(task.tag.toLowerCase());
            }
            if (task.completed) {
                taskElement.classList.add('completed');
            }
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

    addTaskBtn.addEventListener('click', () => {
        const newTask = createTaskElement();
        taskList.insertBefore(newTask, taskList.firstChild);
        saveTasksToLocalStorage();
    });

    function createTaskElement(name = 'New Task', completed = false, date = '', time = '', tag = '') {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.draggable = "true";

        if (completed) {
            li.classList.add('completed');
        }

        const checkbox = document.createElement('input');
        checkbox.checked = completed;
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed');
            saveTasksToLocalStorage();
        });

        const taskColor = document.createElement('div');
        taskColor.className = 'task-color';
        taskColor.style.backgroundColor = tag;

        const taskName = document.createElement('span');
        taskName.className = 'task-name';
        taskName.contentEditable = true;
        taskName.textContent = name;

        taskName.addEventListener('mouseover', () => {
            taskName.style.color = '#333';
        });

        taskName.addEventListener('mouseout', () => {
            taskName.style.color = '';
        });

        const taskCategory = document.createElement('div');
        taskCategory.className = 'task-category';
        const categorySelect = document.createElement('select');
        ['Blue-Very Easy', 'Green-Easy', 'Yellow-Medium', 'Orange-Hard', 'Red-Very Hard'].forEach(item => {
            const [color, difficulty] = item.split('-');
            const option = document.createElement('option');
            option.value = color.toLowerCase();
            option.textContent = difficulty;
            categorySelect.appendChild(option);
        });
        taskCategory.appendChild(categorySelect);

        categorySelect.addEventListener('change', () => {
            taskColor.style.backgroundColor = categorySelect.value;
            li.classList.remove('red', 'orange', 'yellow', 'green', 'blue');
            li.classList.add(categorySelect.value);
            // categorySelect.style.display = 'none';
            saveTasksToLocalStorage();
        });
        
        categorySelect.style.display = 'block';

        categorySelect.value = tag;

        taskCategory.addEventListener('click', () => {
            categorySelect.style.display = 'block';
        });

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

        li.addEventListener('mousedown', (e) => {
            li.draggable = true;
            li.classList.add('dragging');
        });

        li.addEventListener('mouseup', (e) => {
            li.draggable = false;
            li.classList.remove('dragging');
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'X';
        deleteBtn.addEventListener('click', () => {
            li.remove();
            saveTasksToLocalStorage();
        });

        li.appendChild(checkbox);
        li.appendChild(taskColor);
        li.appendChild(taskName);
        li.appendChild(taskCategory);
        li.appendChild(taskDateTime);
        li.appendChild(deleteBtn);

        return li;
    }

    let draggedItem = null;

    taskList.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('dragging')) {
            draggedItem = e.target;
            setTimeout(() => {
                draggedItem.style.display = 'none';
            }, 0);
        }
    });

    taskList.addEventListener('dragend', (e) => {
        setTimeout(() => {
            draggedItem.style.display = '';
            draggedItem = null;
        }, 0);
        e.target.classList.remove('dragging');
        e.target.draggable = false;
        saveTasksToLocalStorage();
    });

    taskList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(taskList, e.clientY);
        if (afterElement == null) {
            taskList.appendChild(draggedItem);
        } else {
            taskList.insertBefore(draggedItem, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    };

    bottomBar.addEventListener('click', () => {
        saveTasksToLocalStorage();
    });
});

// Sorting functions
function sortTasksByName() {
    const tasks = document.querySelectorAll('.task-item');
    const tasksArray = Array.from(tasks);

    tasksArray.sort((a, b) => {
        const nameA = a.querySelector('.task-name').textContent;
        const nameB = b.querySelector('.task-name').textContent;

        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    tasksArray.forEach(task => task.remove());
    tasksArray.forEach(task => document.getElementById('task-list').appendChild(task));
}

function sortTasksByNameDescending() {
    const tasks = document.querySelectorAll('.task-item');
    const tasksArray = Array.from(tasks);

    tasksArray.sort((a, b) => {
        const nameA = a.querySelector('.task-name').textContent;
        const nameB = b.querySelector('.task-name').textContent;

        if (nameA > nameB) return -1;
        if (nameA < nameB) return 1;
        return 0;
    });

    tasksArray.forEach(task => task.remove());
    tasksArray.forEach(task => document.getElementById('task-list').appendChild(task));
}

function sortTasksByDate() {
    const tasks = document.querySelectorAll('.task-item');
    const tasksArray = Array.from(tasks);

    tasksArray.sort((a, b) => {
        const dateA = new Date(a.querySelector('.task-date-input').value + ' ' + a.querySelector('.task-time-input').value);
        const dateB = new Date(b.querySelector('.task-date-input').value + ' ' + b.querySelector('.task-time-input').value);

        return dateA - dateB;
    });

    tasksArray.forEach(task => task.remove());
    tasksArray.forEach(task => document.getElementById('task-list').appendChild(task));
}

function sortTasksByDateDescending() {
    const tasks = document.querySelectorAll('.task-item');
    const tasksArray = Array.from(tasks);

    tasksArray.sort((a, b) => {
        const dateA = new Date(a.querySelector('.task-date-input').value + ' ' + a.querySelector('.task-time-input').value);
        const dateB = new Date(b.querySelector('.task-date-input').value + ' ' + b.querySelector('.task-time-input').value);

        return dateB - dateA;
    });

    tasksArray.forEach(task => task.remove());
    tasksArray.forEach(task => document.getElementById('task-list').appendChild(task));
}

function sortTasksByTag() {
    const tasks = document.querySelectorAll('.task-item');
    const tasksArray = Array.from(tasks);
    const tagColors = ['red', 'orange', 'yellow', 'green', 'blue'];

    tasksArray.sort((a, b) => {
        const tagA = a.querySelector('.task-category select').value.toLowerCase();
        const tagB = b.querySelector('.task-category select').value.toLowerCase();
        
        if (tagColors.indexOf(tagA) > tagColors.indexOf(tagB)) return -1;
        if (tagColors.indexOf(tagA) < tagColors.indexOf(tagB)) return 1;
        return 0;
    });

    tasksArray.forEach(task => task.remove());
    tasksArray.forEach(task => document.getElementById('task-list').appendChild(task));
}

function sortTasksByTagDescending() {
    const tasks = document.querySelectorAll('.task-item');
    const tasksArray = Array.from(tasks);
    const tagColors = ['red', 'orange', 'yellow', 'green', 'blue'];

    tasksArray.sort((a, b) => {
        const tagA = a.querySelector('.task-category select').value.toLowerCase();
        const tagB = b.querySelector('.task-category select').value.toLowerCase();

        if (tagColors.indexOf(tagA) < tagColors.indexOf(tagB)) return -1;
        if (tagColors.indexOf(tagA) > tagColors.indexOf(tagB)) return 1;
        return 0;
    });

    tasksArray.forEach(task => task.remove());
    tasksArray.forEach(task => document.getElementById('task-list').appendChild(task));
}

// Filter functions
function filterTasksByTag(tag) {
    const tasks = document.querySelectorAll('.task-item');

    tasks.forEach(task => {
        const taskTag = task.querySelector('.task-category select').value.toLowerCase();
        if (taskTag === tag.toLowerCase() || tag === 'all') {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}

// Get the sorting buttons
const dateFilterBtn = document.getElementById('date-filter');
const dateFilterBtnDes = document.getElementById('date-filter-descending');

const nameFilterBtn = document.getElementById('name-filter');
const nameFilterBtnDes = document.getElementById('name-filter-descending');

const tagFilterBtn = document.getElementById('tag-filter');
const tagFilterBtnDes = document.getElementById('tag-filter-descending');

dateFilterBtn.addEventListener('click', sortTasksByDate);
dateFilterBtnDes.addEventListener('click', sortTasksByDateDescending);

nameFilterBtn.addEventListener('click', sortTasksByName);
nameFilterBtnDes.addEventListener('click', sortTasksByNameDescending);

tagFilterBtn.addEventListener('click', sortTasksByTag);
tagFilterBtnDes.addEventListener('click', sortTasksByTagDescending);
document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const sortBtn = document.getElementById('sort-btn');
    const sidebar = document.querySelector('.sidebar');
    const closeBtn = document.getElementById('close-sidebar');
    const bottomBar = document.querySelector('bottom-bar');
    const tagList = document.getElementById('tag-list');
    const addTagForm = document.getElementById('add-tag-form');
    const newTagName = document.getElementById('new-tag-name');
    const newTagColor = document.getElementById('new-tag-color');

    /**
     * Save the list of tasks to local storage.
     */
    function saveTasksToLocalStorage() {
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

    /**
     * Load the list of tasks from local storage.
     */
    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskElement = createTaskElement(task.name, task.completed, task.date, task.time, task.difficulty, task.tag);
            taskList.insertBefore(taskElement, taskList.firstChild);
        });
    }

    /**
     * Save the list of tags to local storage.
     */
    function saveTagsToLocalStorage() {
        const tags = Array.from(tagList.children).map(tagItem => {
            return {
                name: tagItem.querySelector('.tag-name').textContent,
                color: tagItem.querySelector('.tag-color').style.backgroundColor
            };
        });
        localStorage.setItem('tags', JSON.stringify(tags));
    }

     /**
     * Load the list of tags from local storage.
     */
    function loadTagsFromLocalStorage() {
        const tags = JSON.parse(localStorage.getItem('tags')) || [];
        tagList.innerHTML = ''; // Clear existing tags in the list
        tags.forEach(tag => {
            const tagElement = createTagElement(tag.name, tag.color);
            tagList.appendChild(tagElement);
        });
        updateAllTaskTagSelects();
    }

    /**
     * Update all task tag selects with the current list of tags.
     */
    function updateAllTaskTagSelects() {
        const tagSelects = document.querySelectorAll('.task-tag select');
        tagSelects.forEach(select => {
            const selectedValue = select.value;
            select.innerHTML = ''; // Clear existing options
            loadTagsIntoSelect(select);
            select.value = selectedValue; // Re-set the previously selected value
        });
    }

    loadTasksFromLocalStorage();
    loadTagsFromLocalStorage();

    sortBtn.addEventListener('click', () => {
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

    addTagForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const tagName = newTagName.value;
        const tagColor = newTagColor.value;
        const tagElement = createTagElement(tagName, tagColor);
        tagList.appendChild(tagElement);
        saveTagsToLocalStorage();
        newTagName.value = '';
        newTagColor.value = '#000000';
        updateAllTaskTagSelects();
    });

    /**
     * Create a tag element.
     * @param {string} name - The name of the tag.
     * @param {string} color - The color of the tag.
     * @returns {HTMLElement} The tag element.
     */
    function createTagElement(name, color) {
        const li = document.createElement('li');
        li.className = 'tag-item';

        const tagNameSpan = document.createElement('span');
        tagNameSpan.className = 'tag-name';
        tagNameSpan.textContent = name;

        const tagColorDiv = document.createElement('div');
        tagColorDiv.className = 'tag-color';
        tagColorDiv.style.backgroundColor = color;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-tag-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            li.remove();
            saveTagsToLocalStorage();
            resetTaskTags(name);
            updateAllTaskTagSelects();
        });

        li.appendChild(tagColorDiv);
        li.appendChild(tagNameSpan);
        li.appendChild(deleteBtn);

        return li;
    }

    /**
     * Create a task element.
     * @param {string} name - The name of the task.
     * @param {boolean} completed - The completion status of the task.
     * @param {string} date - The due date of the task.
     * @param {string} time - The due time of the task.
     * @param {string} difficulty - The difficulty of the task.
     * @param {string} tag - The tag associated with the task.
     * @returns {HTMLElement} The task element.
     */
    function createTaskElement(name = 'New Task', completed = false, date = '', time = '', difficulty = '', tag = '') {
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
        

        taskName.addEventListener('blur', () => {
          saveTasksToLocalStorage();
        });

        /* TASK TAG */

        const taskTag = document.createElement('div');
        taskTag.className = 'task-tag';

        const tagSelect = document.createElement('select');
        loadTagsIntoSelect(tagSelect);

        tagSelect.value = tag;
        const tags = JSON.parse(localStorage.getItem('tags')) || [];
        const tagObject = tags.find(tagItem => tagItem.name === tag);
        tagSelect.style.backgroundColor = tagObject ? tagObject.color : '';

        taskTag.appendChild(tagSelect);

        tagSelect.addEventListener('change', () => {
            const selectedTag = tagSelect.value;
            const tags = JSON.parse(localStorage.getItem('tags')) || [];
            const tagObject = tags.find(tagItem => tagItem.name === selectedTag);
            tagSelect.style.backgroundColor = tagObject ? tagObject.color : '';
            saveTasksToLocalStorage();
        });

        tagSelect.addEventListener('click', () => {
            const tags = JSON.parse(localStorage.getItem('tags')) || [];
            if (tags.length === 0) {
                document.getElementById('manage-tags-popup').style.display = 'flex';
            }
        });

        /* TASK DIFFICULTY */

        const taskDifficulty = document.createElement('div');
        taskDifficulty.className = 'task-difficulty';

        const difficultySelect = document.createElement('select');

        ['blue-Very Easy', 'green-Easy', 'yellow-Medium', 'orange-Hard', 'red-Very Hard'].forEach(item => {
            const [color, difficulty] = item.split('-');
            const option = document.createElement('option');
            option.value = color.toLowerCase();
            option.textContent = difficulty;
            difficultySelect.appendChild(option);
        });

        difficultySelect.value = difficulty;
        difficultySelect.style.backgroundColor = difficulty;

        taskDifficulty.appendChild(difficultySelect);

        difficultySelect.addEventListener('change', () => {
            difficultySelect.style.backgroundColor = difficultySelect.value;
            saveTasksToLocalStorage();
        });

        /* TASK DATE AND TIME */

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

        dateInput.addEventListener('input', () => {
          saveTasksToLocalStorage();
      });

      timeInput.addEventListener('input', () => {
          saveTasksToLocalStorage();
      });

      dateInput.addEventListener('change', () => {
          saveTasksToLocalStorage();
      });

      timeInput.addEventListener('change', () => {
          saveTasksToLocalStorage();
      });

        /* TASK DRAGGING */

        li.addEventListener('mousedown', (e) => {
            li.draggable = true;
            li.classList.add('dragging');
        });

        li.addEventListener('mouseup', (e) => {
            li.draggable = false;
            li.classList.remove('dragging');
        });

        /* TASK DELETION */

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'X';
        deleteBtn.addEventListener('click', () => {
            li.remove();
            saveTasksToLocalStorage();
        });

        li.appendChild(checkbox);
        li.appendChild(taskName);
        li.appendChild(taskTag);
        li.appendChild(taskDifficulty);
        li.appendChild(taskDateTime);
        li.appendChild(deleteBtn);

        return li;
    }

    /**
     * Load tags into the given select element.
     * @param {HTMLSelectElement} selectElement - The select element to load tags into.
     */
    function loadTagsIntoSelect(selectElement) {
        const tags = JSON.parse(localStorage.getItem('tags')) || [];
        tags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag.name;
            option.textContent = tag.name;
            selectElement.appendChild(option);
        });
    }

      /**
     * Reset the task tags to 'Untagged' if the tag is deleted.
     * @param {string} deletedTagName - The name of the deleted tag.
     */
    function resetTaskTags(deletedTagName) {
        const tasks = document.querySelectorAll('.task-item');
        tasks.forEach(task => {
            const tagSelect = task.querySelector('.task-tag select');
            if (tagSelect.value === deletedTagName) {
                tagSelect.value = '';
                tagSelect.style.backgroundColor = '';
            }
        });
        saveTasksToLocalStorage();
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

    /**
    * Gets the closest draggable element after the specified y-coordinate.
    *
    * @param {HTMLElement} container - The container element holding the draggable elements.
    * @param {number} y - The y-coordinate to compare against.
    * @returns {HTMLElement} - The closest draggable element after the y-coordinate.
    */
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
    }

    bottomBar.addEventListener('click', () => {
        saveTasksToLocalStorage();
    });

    document.getElementById('manage-tags-btn').addEventListener('click', function () {
        document.getElementById('manage-tags-popup').style.display = 'flex';
    });

    document.getElementById('close-popup-btn').addEventListener('click', function () {
        document.getElementById('manage-tags-popup').style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        const popup = document.getElementById('manage-tags-popup');
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });
});

// Sorting functions

/**
 * Sorts the tasks by their names in ascending order.
 */
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

/**
 * Sorts the tasks by their names in descending order.
 */
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

/**
 * Sorts the tasks by their date and time in ascending order.
 */
function sortTasksByDate() {
    const tasks = document.querySelectorAll('.task-item');
    const tasksArray = Array.from(tasks);

    tasksArray.sort((a, b) => {
        const dateA = new Date(a.querySelector('.task-date-input').value + 'T' + a.querySelector('.task-time-input').value);
        const dateB = new Date(b.querySelector('.task-date-input').value + 'T' + b.querySelector('.task-time-input').value);

        return dateA - dateB;
    });

    tasksArray.forEach(task => task.remove());
    tasksArray.forEach(task => document.getElementById('task-list').appendChild(task));
}

/**
 * Sorts the tasks by their date and time in descending order.
 */
function sortTasksByDateDescending() {
    const tasks = document.querySelectorAll('.task-item');
    const tasksArray = Array.from(tasks);

    tasksArray.sort((a, b) => {
        const dateA = new Date(a.querySelector('.task-date-input').value + 'T' + a.querySelector('.task-time-input').value);
        const dateB = new Date(b.querySelector('.task-date-input').value + 'T' + b.querySelector('.task-time-input').value);

        return dateB - dateA;
    });

    tasksArray.forEach(task => task.remove());
    tasksArray.forEach(task => document.getElementById('task-list').appendChild(task));
}

/**
 * Sorts the tasks by their tags in ascending order.
 */
function sortTasksByTag() {
    const tasks = document.querySelectorAll('.task-item');
    const tasksArray = Array.from(tasks);
    const tagColors = ['red', 'orange', 'yellow', 'green', 'blue'];

    tasksArray.sort((a, b) => {
        const tagA = a.querySelector('.task-difficulty select').value.toLowerCase();
        const tagB = b.querySelector('.task-difficulty select').value.toLowerCase();

        if (tagColors.indexOf(tagA) > tagColors.indexOf(tagB)) return -1;
        if (tagColors.indexOf(tagA) < tagColors.indexOf(tagB)) return 1;
        return 0;
    });

    tasksArray.forEach(task => task.remove());
    tasksArray.forEach(task => document.getElementById('task-list').appendChild(task));
}

/**
 * Sorts the tasks by their tags in descending order.
 */
function sortTasksByTagDescending() {
    const tasks = document.querySelectorAll('.task-item');
    const tasksArray = Array.from(tasks);
    const tagColors = ['red', 'orange', 'yellow', 'green', 'blue'];

    tasksArray.sort((a, b) => {
        const tagA = a.querySelector('.task-difficulty select').value.toLowerCase();
        const tagB = b.querySelector('.task-difficulty select').value.toLowerCase();

        if (tagColors.indexOf(tagA) < tagColors.indexOf(tagB)) return -1;
        if (tagColors.indexOf(tagA) > tagColors.indexOf(tagB)) return 1;
        return 0;
    });

    tasksArray.forEach(task => task.remove());
    tasksArray.forEach(task => document.getElementById('task-list').appendChild(task));
}

/**
 * Filters the tasks based on the specified tag.
 *
 * @param {string} tag - The tag to filter tasks by.
 */
function filterTasksByTag(tag) {
    const tasks = document.querySelectorAll('.task-item');

    tasks.forEach(task => {
        const taskTag = task.querySelector('.task-difficulty select').value.toLowerCase();
        if (taskTag === tag.toLowerCase() || tag === 'all') {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}

// Get the sorting buttons
const dateSortBtn = document.getElementById('date-sort');
const dateSortBtnDes = document.getElementById('date-sort-descending');

const nameSortBtn = document.getElementById('name-sort');
const nameSortBtnDes = document.getElementById('name-sort-descending');

const tagSortBtn = document.getElementById('tag-sort');
const tagSortBtnDes = document.getElementById('tag-sort-descending');

dateSortBtn.addEventListener('click', sortTasksByDate);
dateSortBtnDes.addEventListener('click', sortTasksByDateDescending);

nameSortBtn.addEventListener('click', sortTasksByName);
nameSortBtnDes.addEventListener('click', sortTasksByNameDescending);

tagSortBtn.addEventListener('click', sortTasksByTag);
tagSortBtnDes.addEventListener('click', sortTasksByTagDescending);

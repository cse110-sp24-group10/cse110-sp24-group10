document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const filterBtn = document.getElementById('filter-btn');
    const sidebar = document.querySelector('.sidebar');
    const closeBtn = document.getElementById('close-sidebar');

    //storage
    loadTasksFromLocalStorage();
    
    filterBtn.addEventListener('click', () => {
        sidebar.classList.toggle('show-sidebar');
    });
    
    closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('show-sidebar');
    });
    
    //Button to add task
    addTaskBtn.addEventListener('click', () => {
        const newTask = createTaskElement();
        taskList.insertBefore(newTask, taskList.firstChild);

        // storage
        saveTasksToLocalStorage();
    });

    //Task element
    function createTaskElement() {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.draggable = "true";

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed');

            //storage
            saveTasksToLocalStorage();
        });

        const taskColor = document.createElement('div');
        taskColor.className = 'task-color';

        const taskName = document.createElement('span');
        taskName.className = 'task-name';
        taskName.contentEditable = true;
        taskName.textContent = 'New Task';

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
        });

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
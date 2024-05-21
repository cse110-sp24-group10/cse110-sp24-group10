document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');

    addTaskBtn.addEventListener('click', () => {
        const newTask = createTaskElement();
        taskList.insertBefore(newTask, taskList.firstChild);
    });

    function createTaskElement() {
        const li = document.createElement('li');
        li.className = 'task-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed');
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

        const taskCategory = document.createElement('div');
        taskCategory.className = 'task-category';
        const categorySelect = document.createElement('select');
        ['Red', 'Blue', 'Green', 'Yellow', 'Purple'].forEach(color => {
            const option = document.createElement('option');
            option.value = color.toLowerCase();
            option.textContent = color;
            categorySelect.appendChild(option);
        });
        taskCategory.appendChild(categorySelect);

        categorySelect.addEventListener('change', () => {
            taskColor.style.backgroundColor = categorySelect.value;
            categorySelect.style.display = 'none';
        });

        taskCategory.addEventListener('click', () => {
            categorySelect.style.display = 'block';
        });

        const taskDifficulty = document.createElement('div');
        taskDifficulty.className = 'task-difficulty';
        const difficultySelect = document.createElement('select');
        ['Easy', 'Medium', 'Hard'].forEach(level => {
            const option = document.createElement('option');
            option.value = level.toLowerCase();
            option.textContent = level;
            difficultySelect.appendChild(option);
        });
        taskDifficulty.appendChild(difficultySelect);

        taskDifficulty.addEventListener('click', () => {
            difficultySelect.style.display = 'block';
        });

        const taskDate = document.createElement('div');
        taskDate.className = 'task-date';
        const dateInput = document.createElement('input');
        dateInput.type = 'text';
        dateInput.placeholder = 'MM/DD/YYYY';
        taskDate.appendChild(dateInput);

        taskDate.addEventListener('click', () => {
            dateInput.style.display = 'block';
        });

        const colorTagBtn = document.createElement('button');
        colorTagBtn.className = 'color-tag-btn';
        colorTagBtn.textContent = 'Add Tag';
        colorTagBtn.addEventListener('click', () => {
            taskCategory.click();
        });

        const reorderBtn = document.createElement('button');
        reorderBtn.className = 'reorder-btn';
        reorderBtn.textContent = '↕';

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
        li.appendChild(taskDifficulty);
        li.appendChild(taskDate);
        li.appendChild(colorTagBtn);
        li.appendChild(reorderBtn);
        li.appendChild(deleteBtn);

        return li;
    }

});
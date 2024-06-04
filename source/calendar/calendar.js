// Select necessary elements from the DOM
const monthYear = document.querySelector(".monthANDyear");
dayTag = document.querySelector(".day");
toggleIcons = document.querySelectorAll(".icons span");
const popup = document.getElementById("popup");
const popupDate = document.getElementById("popup-date");
const taskList = document.getElementById("task-list");
const closeBtn = document.querySelector(".popup .close");

/**
 * Load tasks for a specific date from localStorage and display them in the task list.
 * @param {Date} date - The date for which tasks need to be loaded.
 */
const loadTasksForDate = (date) => {
    // Retrieve tasks from localStorage or set to empty array if none exist
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // Filter tasks for the specified date
    const tasksForTheDay = tasks.filter(task => {
        const taskDate = new Date(task.date);
        // Adjust for timezone offset
        const adjustedTaskDate = new Date(taskDate.getTime() + taskDate.getTimezoneOffset() * 60000);
        return adjustedTaskDate.toDateString() === date.toDateString();
    });

    // Display tasks or a message if no tasks exist for the specified date
    if (tasksForTheDay.length > 0) {
        taskList.innerHTML = tasksForTheDay.map(task => {
            const taskDate = new Date(task.date);
            const formattedDate = `${taskDate.getMonth() + 1}/${taskDate.getDate() + 1}/${taskDate.getFullYear()}`;
            const completed = task.completed ? 'Completed' : 'Not Completed';
            return `<div class="task">${task.name}: ${task.tag} - (${formattedDate} - (${completed}))</div>`;
        }).join('');
    } else {
        taskList.innerHTML = '<li class="noTask">No tasks for today.</li>';
    }
};

/**
 * Event listener to load tasks when the window loads.
 */
window.addEventListener("load", () => {
    const today = new Date();
    // Display today's date in the popup
    popupDate.innerText = `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
    loadTasksForDate(today);
    popup.style.display = "flex"; // Show the popup
});

/**
 * Add click event to each day element to display tasks for the selected day.
 */
const addDayClickEvent = () => {
    document.querySelectorAll(".day li").forEach(day => {
        day.addEventListener("click", () => {
            const selectedDay = day.innerText;
            let selectedDate = new Date(currYear, currMonth, selectedDay);
            // Adjust date if day is from the previous or next month
            if (day.classList.contains("faded-past")) {
                selectedDate = new Date(currYear, currMonth - 1, selectedDay);
            } else if (day.classList.contains("faded-future")) {
                selectedDate = new Date(currYear, currMonth + 1, selectedDay);
            }
            // Update popup with the selected date and load tasks
            popupDate.innerText = `${months[selectedDate.getMonth()]} ${selectedDay}, ${selectedDate.getFullYear()}`;
            loadTasksForDate(selectedDate);
            popup.style.display = ""; // Show the popup
        });
    });
}

// Event listener to close the popup when the close button is clicked
closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
});

// Event listener to close the popup when clicking outside of it
window.addEventListener("click", (event) => {
    if (event.target == popup) {
        popup.style.display = "none";
    }
});

let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();

// List of months to choose from
const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

/**
 * Function to create the calendar for the current month and year.
 * Dynamically updates the days displayed based on the current month and year.
 */
const createCalendar = () => {
    monthYear.innerText = `${months[currMonth]} ${currYear}`;
    let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay();
    let lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
    let prevLastDateOfMonth = new Date(currYear, currMonth, 0).getDate();
    let lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay();
    let liTag = "";

    // List dates of the previous month
    for (let i = firstDayOfMonth; i > 0; i--) {
        liTag += `<li class="faded-past">${prevLastDateOfMonth - i + 1}</li>`;
    }
    // List dates of the current month
    for (let i = 1; i <= lastDateOfMonth; i++) {
        // Highlight today's date
        let today = "";
        if (i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear()) {
            today = "highlighted";
        }
        liTag += `<li class="${today}">${i}</li>`;
    }
    // List dates of the next month (first few days)
    for (let i = lastDayOfMonth; i < 6; i++) {
        liTag += `<li class="faded-future">${i - lastDayOfMonth + 1}</li>`;
    }

    dayTag.innerHTML = liTag; // Update the calendar days
    addDayClickEvent(); // Ensure event listeners are added after calendar is created
}
createCalendar();

// Event listeners for month navigation icons
toggleIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        // If previous button is clicked, decrement the month; otherwise, increment the month
        if (icon.id === "prev") {
            currMonth = currMonth - 1;
        } else {
            currMonth += 1;
        }
        // Update the year if scrolling past or before the current year
        if (currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth);
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        } else {
            date = new Date();
        }
        createCalendar(); // Recreate the calendar with the new month and year
    });
});

// Event listener for Add Task button
addTaskBtn.addEventListener("click", () => {
    window.location.href = "../tasks/tasks.html"; // Redirect to the tasks page to add a new task
});

// Event listener for Journal Link button
journalLinkBtn.addEventListener("click", () => {
    window.location.href = "../journal/journal.html"; // Redirect to the journal page
});

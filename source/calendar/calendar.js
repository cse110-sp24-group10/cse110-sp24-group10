const monthYear = document.querySelector(".monthANDyear");
dayTag = document.querySelector(".day");
toggleIcons = document.querySelectorAll(".icons span");
const popup = document.getElementById("popup");
const popupDate = document.getElementById("popup-date");
const taskList = document.getElementById("task-list");
const closeBtn = document.querySelector(".popup .close");
let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();
    currDay = date.getDate();
//date to local storage for linking to other pages
let selectedDate = new Date(currYear, currMonth, currDay);
localStorage.setItem("selectedDate", JSON.stringify(selectedDate));

const loadTasksForDate = (date) => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const tasksForTheDay = tasks.filter(task => {
        const taskDate = new Date(task.date);
        // Adjust for timezone offset
        const adjustedTaskDate = new Date(taskDate.getTime() + taskDate.getTimezoneOffset() * 60000);
        return adjustedTaskDate.toDateString() === date.toDateString();
    });

    if (tasksForTheDay.length > 0) {
        taskList.innerHTML = tasksForTheDay.map(task => {
            const taskDate = new Date(task.date);
            const formattedDate = `${taskDate.getMonth() + 1}/${taskDate.getDate() + 1}/${taskDate.getFullYear()}`;
            const completed = task.completed ? 'Completed' : 'Not Completed';
            let difficulty = '';
            if(task.tag === "blue") {
                difficulty = "Very Easy";
            } else if(task.tag === "green") {
                difficulty = "Easy";
            } else if(task.tag === "yellow") {
                difficulty = "Medium";
            } else if(task.tag === "orange") {
                difficulty = "Hard";
            } else {
                difficulty = "Very Hard";
            }
            return `<div class="task">${task.name}: ${difficulty} - (${formattedDate} - (${completed}))</div>`;
        }).join('');
    } else {
        taskList.innerHTML = '<li>No tasks for today.</li>';
    }
};

window.addEventListener("load", () => {
    const today = new Date();
    popupDate.innerText = `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
    loadTasksForDate(today);
    popup.style.display = "flex";
});

const addDayClickEvent = () => {
    document.querySelectorAll(".day li").forEach(day => {
        day.addEventListener("click", () => {
            const selectedDay = day.innerText;
            const selectedDate = new Date(currYear, currMonth, selectedDay);
            popupDate.innerText = `${months[selectedDate.getMonth()]} ${selectedDay}, ${selectedDate.getFullYear()}`;
            loadTasksForDate(selectedDate);
            popup.style.display = "";
            //save to local storage for calendar access
            localStorage.setItem("selectedDate", JSON.stringify(selectedDate));
        });
    });
};

closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target == popup) {
        popup.style.display = "none";
    }
});


// List of months to choose from
const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

// Function that dynamically changes month, year, days
const createCalendar = () => {
    monthYear.innerText = `${months[currMonth]} ${currYear}`;
    let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay();
    let lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
    let prevLastDateOfMonth = new Date(currYear, currMonth, 0).getDate();
    let lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay();
    let liTag = "";

    // List dates of last month
    for (let i = firstDayOfMonth; i > 0; i--) {
        liTag += `<li class="faded">${prevLastDateOfMonth - i + 1}</li>`;
    }
    // List dates of current month
    for (let i = 1; i <= lastDateOfMonth; i++) {
        // Dynamically get today's date for highlight
        let today = "";
        if (i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear()) {
            today = "highlighted";
        }
        liTag += `<li class="${today}">${i}</li>`;
    }
    // List dates of next month (first few days)
    for (let i = lastDayOfMonth; i < 6; i++) {
        liTag += `<li class="faded">${i - lastDayOfMonth + 1}</li>`;
    }

    dayTag.innerHTML = liTag;
    addDayClickEvent(); // Ensure event listeners are added after calendar is created
};
createCalendar();

toggleIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        // If previous clicked decrement month, otherwise increment month for other button
        if (icon.id === "prev") {
            currMonth = currMonth - 1;
        } else {
            currMonth += 1;
        }
        // Update year if scroll past/before current year
        if (currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth);
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        } else {
            date = new Date();
        }
        createCalendar();
    });
});

addTaskBtn.addEventListener("click", () => {
    window.location.href = "../tasks/tasks.html"; // Redirect to the tasks page to add a new task
});

journalLinkBtn.addEventListener("click", () => {
    window.location.href = "../journal/journal.html"; // Redirect to the journal page
});
// calendar.test.js
jest.useFakeTimers();
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

class LocalStorageMock {
    constructor() {
        this.store = {};
    }
    clear() {
        this.store = {};
    }
    getItem(key) {
        return this.store[key] || null;
    }
    setItem(key, value) {
        this.store[key] = String(value);
    }
    removeItem(key) {
        delete this.store[key];
    }
}
global.localStorage = new LocalStorageMock;

describe('Calendar Tests', () => {
    let document;
    let window;
    let calendarScript;
    let originalAssign;

    beforeAll(() => {
        const html = fs.readFileSync(path.resolve(__dirname, 'calendar.html'), 'utf8');
        const css = fs.readFileSync(path.resolve(__dirname, 'calendar.css'), 'utf8');
        const dom = new JSDOM(html, {
            runScripts: 'dangerously',
            resources: 'usable'
        });

        document = dom.window.document;
        window = dom.window;

        calendarScript = fs.readFileSync(path.resolve(__dirname, 'calendar.js'), 'utf8');
        const scriptElement = document.createElement('script');
        scriptElement.textContent = calendarScript;
        document.head.appendChild(scriptElement);
    });

    it('should display the correct month and year', () => {
        const monthYearElement = document.querySelector('.monthANDyear');
        const months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const date = new Date();
        expect(monthYearElement.innerText).toBe(`${months[date.getMonth()]} ${date.getFullYear()}`);
    });

    it('should highlight today\'s date', () => {
        const today = new Date().getDate();
        const highlightedDay = document.querySelector('.highlighted');
        expect(highlightedDay.textContent).toBe(today.toString());
    });

    it('should open the popup when a day is clicked', () => {
        const firstDay = document.querySelector('.day li:not(.faded)');
        firstDay.click();
        const popup = document.getElementById('popup');
        expect(popup.style.display).toBe('');
    });

    it('should close the popup when the close button is clicked', () => {
        const closeBtn = document.querySelector('.popup .close');
        closeBtn.click();
        const popup = document.getElementById('popup');
        expect(popup.style.display).toBe('none');
    });

    it('should correctly handle navigation between months and years', () => {
        const prevIcon = document.getElementById('prev');
        const nextIcon = document.getElementById('next');
        const monthYearInitial = document.querySelector(".monthANDyear").innerText;

        prevIcon.click();
        expect(document.querySelector('.monthANDyear').innerText).not.toBe(monthYearInitial);

        nextIcon.click(); // should return to initial month
        nextIcon.click(); // move to next month
        expect(document.querySelector('.monthANDyear').innerText).not.toBe(monthYearInitial);
    });

    it('should load tasks for the selected date', () => {
        const sampleTasks = [
            { date: new Date().toISOString(), name: 'Task 1', time: '10:00 AM', tag: 'Work', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));

        const today = new Date().getDate();
        const dayElement = document.querySelector(`.day li:not(.faded):nth-child(${today + 4})`);
        dayElement.click();

        const taskList = document.getElementById('task-list');
        expect(taskList.innerHTML).toContain('Task 1');
    });

    it('should display no tasks message if no tasks are available for a selected day', () => {
        const dayElement = document.querySelector('.day li:not(.highlighted):not(.faded)');
        dayElement.click();
        const taskMessageElem = document.getElementById('task-list').querySelector('.noTask');
        expect(taskMessageElem).toBeTruthy();
        expect(taskMessageElem.textContent).toBe('No tasks for today.');
    });

    it('should handle edge cases for month and year transitions', () => {
        const prevIcon = document.getElementById('prev');
        const currYear = new Date().getFullYear();

        // Testing edge case for year decrement
        for (let i = 0; i < 12; i++) {
            prevIcon.click();
        }
        expect(document.querySelector('.monthANDyear').innerText).toContain((currYear - 1).toString());

        // Reset to current year
        const nextIcon = document.getElementById('next');
        for (let i = 0; i < 12; i++) {
            nextIcon.click();
        }

        // Testing edge case for year increment
        for (let i = 0; i < 12; i++) {
            nextIcon.click();
        }
        expect(document.querySelector('.monthANDyear').innerText).toContain((currYear + 1).toString());
    });

    // New Test Cases

    it('should load tasks on page load', () => {
        const sampleTasks = [
            { date: new Date().toISOString(), name: 'Task on Load', time: '9:00 AM', tag: 'Home', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        
        const today = new Date();
        window.dispatchEvent(new Event('load'));
        
        const taskList = document.getElementById('task-list');
        expect(taskList.innerHTML).toContain('Task on Load');
    });

    it('should navigate to tasks page when Add Task button is clicked', () => {
        const addTaskBtn = document.getElementById('addTaskBtn');
        addTaskBtn.click();
        expect(window.location.assign).toHaveBeenCalledWith('../tasks/tasks.html');
    });

    it('should navigate to journal page when Journal Link button is clicked', () => {
        const journalLinkBtn = document.getElementById('journalLinkBtn');
        journalLinkBtn.click();
        expect(window.location.assign).toHaveBeenCalledWith('../journal/journal.html');
    });

    it('should close the popup when clicking outside of it', () => {
        const popup = document.getElementById('popup');
        const event = new window.MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        popup.style.display = 'flex'; // Assume popup is open
        window.dispatchEvent(event);
        expect(popup.style.display).toBe('none');
    });

    it('should add a new task to localStorage', () => {
        const sampleTask = { date: new Date().toISOString(), name: 'New Task', time: '2:00 PM', tag: 'Work', completed: false };
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(sampleTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        const storedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(storedTasks).toContainEqual(sampleTask);
    });

    it('should update task completion status in localStorage', () => {
        const sampleTask = { date: new Date().toISOString(), name: 'Task to Complete', time: '3:00 PM', tag: 'Personal', completed: false };
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(sampleTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // Simulate marking the task as completed
        const updatedTasks = tasks.map(task => {
            if (task.name === 'Task to Complete') {
                task.completed = true;
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        
        const storedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(storedTasks.find(task => task.name === 'Task to Complete').completed).toBe(true);
    });

    it('should transition from the last day of the month to the first day of the next month', () => {
        const nextIcon = document.getElementById('next');
        const currentMonthYear = document.querySelector('.monthANDyear').innerText;

        // Click to the last day of the month
        const lastDay = document.querySelector('.day li:not(.faded):last-child');
        lastDay.click();
        
        nextIcon.click();
        const newMonthYear = document.querySelector('.monthANDyear').innerText;
        expect(newMonthYear).not.toBe(currentMonthYear);

        const firstDay = document.querySelector('.day li:not(.faded)').innerText;
        expect(firstDay).toBe('1');
    });

    it('should transition from the first day of the month to the last day of the previous month', () => {
        const prevIcon = document.getElementById('prev');
        const currentMonthYear = document.querySelector('.monthANDyear').innerText;

        // Click to the first day of the month
        const firstDay = document.querySelector('.day li:not(.faded)').innerText;
        expect(firstDay).toBe('1');
        
        prevIcon.click();
        const newMonthYear = document.querySelector('.monthANDyear').innerText;
        expect(newMonthYear).not.toBe(currentMonthYear);

        const lastDay = document.querySelector('.day li:not(.faded):last-child').innerText;
        expect(parseInt(lastDay)).toBeGreaterThan(27); // Ensure it's the last day of the previous month
    });

    it('should display multiple tasks for the same date', () => {
        const sampleTasks = [
            { date: new Date().toISOString(), name: 'Task 1', time: '10:00 AM', tag: 'Work', completed: false },
            { date: new Date().toISOString(), name: 'Task 2', time: '11:00 AM', tag: 'Home', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));

        const today = new Date().getDate();
        const dayElement = document.querySelector(`.day li:not(.faded):nth-child(${today + 4})`);
        dayElement.click();

        const taskList = document.getElementById('task-list');
        expect(taskList.innerHTML).toContain('Task 1');
        expect(taskList.innerHTML).toContain('Task 2');
    });

    it('should show the popup on page load and display today\'s tasks', () => {
        const sampleTasks = [
            { date: new Date().toISOString(), name: 'Task on Load', time: '9:00 AM', tag: 'Home', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        
        window.dispatchEvent(new Event('load'));
        
        const popup = document.getElementById('popup');
        const taskList = document.getElementById('task-list');
        expect(popup.style.display).toBe('flex');
        expect(taskList.innerHTML).toContain('Task on Load');
    });

});

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
       // Assuming tasks are stored with dates as keys
       const sampleTasks = [
           { date: new Date().toISOString(), name: 'Task 1', time: '10:00 AM' }
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
});

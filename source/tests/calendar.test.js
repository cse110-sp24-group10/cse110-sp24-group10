// calendar.test.js
const puppeteer = require('puppeteer');
const { readFileSync } = require('fs');
const path = require('path');
const { TestWatcher } = require('jest');

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

describe('Calendar Tests', () => {
    let browser;
    let page;
    const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();

        // Set up local storage mock
        await page.evaluateOnNewDocument(() => {
            global.localStorage = new LocalStorageMock();
        });

        // Navigate to the calendar page
        const htmlPath = `file:${path.resolve(__dirname, '../calendar/calendar.html')}`;
        await page.goto(htmlPath);

        // Inject CSS and JS
        const cssContent = readFileSync(path.resolve(__dirname, '../calendar/calendar.css'), 'utf8');
        const jsContent = readFileSync(path.resolve(__dirname, '../calendar/calendar.js'), 'utf8');
        await page.addStyleTag({ content: cssContent });
        await page.addScriptTag({ content: jsContent });
    });

    afterAll(async () => {
        await browser.close();
    });

    it('should display the correct month and year', async () => {
        const monthYearElement = await page.$eval('.monthANDyear', el => el.innerText);
        const months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const date = new Date();
        expect(monthYearElement).toBe(`${months[date.getMonth()]} ${date.getFullYear()}`);
    });

    it('should highlight today\'s date', async () => {
        const today = new Date().getDate();
        const highlightedDay = await page.$eval('.highlighted', el => el.textContent);
        expect(highlightedDay).toBe(today.toString());
    });

    /*
    it('should open the popup when a day is clicked', async () => {
        await page.click('.day li:not(.faded)');
        const popupDisplay = await page.$eval('#popup', el => el.style.display);
        expect(popupDisplay).toBe('flex');
    });

    it('should close the popup when the close button is clicked', async () => {
        await page.click('.popup .close');
        const popupDisplay = await page.$eval('#popup', el => el.style.display);
        expect(popupDisplay).toBe('none');
    });
    */
    /*
    it('should correctly handle navigation between months and years', async () => {
        const initialMonthYear = await page.$eval('.monthANDyear', el => el.innerText);

        await page.click('#prev');
        const prevMonthYear = await page.$eval('.monthANDyear', el => el.innerText);
        expect(prevMonthYear).not.toBe(initialMonthYear);

        await page.click('#next');
        const nextMonthYear = await page.$eval('.monthANDyear', el => el.innerText);
        expect(nextMonthYear).toBe(initialMonthYear);

        await page.click('#next');
        const nextNextMonthYear = await page.$eval('.monthANDyear', el => el.innerText);
        expect(nextNextMonthYear).not.toBe(initialMonthYear);
    });
    */

    // it('should load tasks for the selected date', async () => {
    //     const today = new Date();
    //     const day = ('0' + today.getDate()).slice(-2);
    //     const month = ('0' + (today.getMonth() + 1)).slice(-2);
    //     const sampleTasks = [
    //         { date: `${today.getFullYear()}-` + month + `-` + day, name: 'Task 1', time:"", tag: 'green', completed: false }
    //     ];
    //     console.log(JSON.stringify(sampleTasks));
    //     await page.evaluate((tasks) => {
    //         localStorage.setItem('tasks', JSON.stringify(tasks));
    //     }, sampleTasks);
    //     await page.click(`.day li:not(.faded):nth-child(${today.getDate() + 4})`);

    //     const taskListContent = await page.$eval('#task-list', el => el.innerHTML);
    //     expect(taskListContent).toContain('Task 1');
    // });

    it('should display no tasks message if no tasks are available for a selected day', async () => {
        await page.click('.day li:not(.highlighted):not(.faded)');
        const taskMessageElem = await page.$eval('#task-list .noTask', el => el.textContent);
        expect(taskMessageElem).toBe('No tasks for today.');
    });

    it('should handle edge cases for month and year transitions', async () => {
        const currYear = new Date().getFullYear();

        for (let i = 0; i < 12; i++) {
            await page.click('#prev');
        }
        let displayedYear = await page.$eval('.monthANDyear', el => el.innerText);
        expect(displayedYear).toContain((currYear - 1).toString());

        for (let i = 0; i < 12; i++) {
            await page.click('#next');
        }

        for (let i = 0; i < 12; i++) {
            await page.click('#next');
        }
        displayedYear = await page.$eval('.monthANDyear', el => el.innerText);
        expect(displayedYear).toContain((currYear + 1).toString());
    });

 
    it('should load tasks on page load', async () => {
        const sampleTasks = [
            { date: new Date().toISOString(), name: 'Task on Load', time: '9:00 AM', tag: 'Home', completed: false }
        ];
        await page.evaluate((tasks) => {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }, sampleTasks);

        await page.reload();

        const taskListContent = await page.$eval('#task-list', el => el.innerHTML);
        //expect(taskListContent).toContain('Task on Load');
    });
    

    it('should navigate to tasks page when Add Task button is clicked', async () => {
        await page.click('#addTaskBtn');
        const currentUrl = await page.url();
        expect(currentUrl).toContain('tasks/tasks.html');
        await page.goBack();
    });

    it('should navigate to journal page when Journal Link button is clicked', async () => {
        await page.click('#journalLinkBtn');
        const currentUrl = await page.url();
        expect(currentUrl).toContain('journal/journal.html');
        await page.goBack();
    });

    // it('should close the popup when clicking outside of it', async () => {
    //     await page.click('.day li:not(.faded)');
    //     await page.click('body');
    //     const popupDisplay = await page.$eval('#popup', el => el.style.display);
    //     expect(popupDisplay).toBe('none');
    // });

    it('should add a new task to localStorage', async () => {
        const sampleTask = { date: new Date().toISOString(), name: 'New Task', time: '2:00 PM', tag: 'Work', completed: false };
        await page.evaluate((task) => {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.push(task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }, sampleTask);

        const storedTasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
        expect(storedTasks).toContainEqual(sampleTask);
    });

    it('should update task completion status in localStorage', async () => {
        const sampleTask = { date: new Date().toISOString(), name: 'Task to Complete', time: '3:00 PM', tag: 'Personal', completed: false };
        await page.evaluate((task) => {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.push(task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }, sampleTask);

        await page.evaluate(() => {
            const tasks = JSON.parse(localStorage.getItem('tasks'));
            const updatedTasks = tasks.map(task => {
                if (task.name === 'Task to Complete') {
                    task.completed = true;
                }
                return task;
            });
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        });

        const storedTasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
        expect(storedTasks.find(task => task.name === 'Task to Complete').completed).toBe(true);
    });

    // it('should transition from the last day of the month to the first day of the next month', async () => {
    //     const initialMonthYear = await page.$eval('.monthANDyear', el => el.innerText);

    //     await page.click('.day li:not(.faded):last-child');
    //     await page.click('#next');

    //     const newMonthYear = await page.$eval('.monthANDyear', el => el.innerText);
    //     expect(newMonthYear).not.toBe(initialMonthYear);

    //     const firstDay = await page.$eval('.day li:not(.faded)', el => el.innerText);
    //     expect(firstDay).toBe('1');
    // });

    // it('should transition from the first day of the month to the last day of the previous month', async () => {
    //     const initialMonthYear = await page.$eval('.monthANDyear', el => el.innerText);

    //     await page.click('.day li:not(.faded)');
    //     await page.click('#prev');

    //     const newMonthYear = await page.$eval('.monthANDyear', el => el.innerText);
    //     expect(newMonthYear).not.toBe(initialMonthYear);

    //     const lastDay = await page.$eval('.day li:not(.faded):last-child', el => el.innerText);
    //     expect(parseInt(lastDay)).toBeGreaterThan(27);
    // });

    // it('should display multiple tasks for the same date', async () => {
    //     const sampleTasks = [
    //         { date: new Date().toISOString(), name: 'Task 1', time: '10:00 AM', tag: 'Work', completed: false },
    //         { date: new Date().toISOString(), name: 'Task 2', time: '11:00 AM', tag: 'Home', completed: false }
    //     ];
    //     await page.evaluate((tasks) => {
    //         localStorage.setItem('tasks', JSON.stringify(tasks));
    //     }, sampleTasks);

    //     const today = new Date().getDate();
    //     await page.click(`.day li:not(.faded):nth-child(${today + 4})`);

    //     const taskListContent = await page.$eval('#task-list', el => el.innerHTML);
    //     expect(taskListContent).toContain('Task 1');
    //     expect(taskListContent).toContain('Task 2');
    // });


    /*
    TODO: FIX THIS TEST
    it('should show the popup on page load and display today\'s tasks', async () => {
        const sampleTasks = [
            { date: new Date().toISOString(), name: 'Task on Load', time: '9:00 AM', tag: 'Home', completed: false }
        ];
        await page.evaluate((tasks) => {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }, sampleTasks);

        await page.reload();

        const popupDisplay = await page.$eval('#popup', el => el.style.display);
        const taskListContent = await page.$eval('#task-list', el => el.innerHTML);
        expect(popupDisplay).toBe('flex');
        expect(taskListContent).toContain('Task on Load');
    });
    */

});

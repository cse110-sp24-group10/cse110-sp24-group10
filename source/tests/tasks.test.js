const puppeteer = require('puppeteer');
const { readFileSync } = require('fs');
const path = require('path');

page.on('console', msg => {
    for (let i = 0; i < msg.args().length; ++i)
      console.log(`${i}: ${msg.args()[i]}`);
});

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

describe('Task List Tests', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();

        // Set up local storage mock
        await page.evaluateOnNewDocument(() => {
            global.localStorage = new LocalStorageMock();
        });

        // Navigate to the tasks page
        const htmlPath = `file:${path.resolve(__dirname, '../tasks/tasks.html')}`;
        await page.goto(htmlPath);

        // Inject CSS and JS
        const cssContent = readFileSync(path.resolve(__dirname, '../tasks/tasks.css'), 'utf8');
        const jsContent = readFileSync(path.resolve(__dirname, '../tasks/tasks.js'), 'utf8');
        await page.addStyleTag({ content: cssContent });
        await page.addScriptTag({ content: jsContent });
    });

    afterAll(async () => {
        await browser.close();
    });

    it('Should load tasks from local storage', async () => {
        await page.evaluate(() => {
            const tasks = [
                { name: 'Task 1', completed: false, date: '2024-06-08', time: '12:00', difficulty: 'blue', tag: 'tag1' },
                { name: 'Task 2', completed: true, date: '2024-06-08', time: '13:00', difficulty: 'green', tag: 'tag2' }
            ];
            localStorage.setItem('tasks', JSON.stringify(tasks));
        });

        await page.reload();

        const taskNames = await page.$$eval('.task-name', tasks => tasks.map(task => task.textContent));
        expect(taskNames).toEqual(expect.arrayContaining(['Task 1', 'Task 2']));
    });

    it('Should save new task to local storage', async () => {
        await page.click('#add-task-btn');
        await page.type('.task-name', 'New Task');

        // Save the task by triggering a blur event
        await page.$eval('.task-name', el => el.blur());

        const storedTasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
        expect(storedTasks).toEqual(expect.arrayContaining([{ name: 'New Task', completed: false, date: '', time: '', difficulty: '', tag: '' }]));
    });

    it('Should load tags from local storage', async () => {
        await page.evaluate(() => {
            const tags = [
                { name: 'tag1', color: '#ff0000' },
                { name: 'tag2', color: '#00ff00' }
            ];
            localStorage.setItem('tags', JSON.stringify(tags));
        });

        await page.reload();

        const tagNames = await page.$$eval('.tag-name', tags => tags.map(tag => tag.textContent));
        expect(tagNames).toEqual(expect.arrayContaining(['tag1', 'tag2']));
    });

    it('Should save new tag to local storage', async () => {
        await page.click('#manage-tags-btn');
        await page.type('#new-tag-name', 'NewTag');
        await page.click('#new-tag-color');
        await page.click('button[type="submit"]');

        const storedTags = await page.evaluate(() => JSON.parse(localStorage.getItem('tags')));
        expect(storedTags).toEqual(expect.arrayContaining([{ name: 'NewTag', color: 'rgb(0, 0, 0)' }]));
    });

    it('Should sort tasks by name', async () => {
      // Open sort options
      await page.evaluate(() => document.querySelector('#sort-btn').click());
      // Wait for the sidebar to become visible
      await page.waitForSelector('.sidebar');
      // Ensure the sort button is visible and enabled before clicking
      await page.waitForSelector('#name-sort', { visible: true, timeout: 2000 });
      await page.evaluate(() => document.querySelector('#name-sort').click());
      await page.waitForTimeout(1000); // Ensure sorting completes
    
      const taskNames = await page.$$eval('.task-name', tasks => tasks.map(task => task.textContent));
      expect(taskNames).toEqual(['New Task', 'Task 1', 'Task 2']);
    });
    
    it('Should sort tasks by date', async () => {
      // Open sort options
      await page.evaluate(() => document.querySelector('#sort-btn').click());
      // Wait for the sidebar to become visible
      await page.waitForSelector('.sidebar');
      // Ensure the sort button is visible and enabled before clicking
      await page.waitForSelector('#date-sort', { visible: true, timeout: 2000 });
      await page.evaluate(() => document.querySelector('#date-sort').click());
      await page.waitForTimeout(1000); // Ensure sorting completes
    
      const taskDates = await page.$$eval('.task-date-input', tasks => tasks.map(task => task.value));
      expect(taskDates).toEqual(['2024-06-08', '2024-06-08', '']);
    });

    
});

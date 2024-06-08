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

describe('Journal Tests', () => {
    let browser;
    let page;
    let currDate = new Date();

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();

        // Set up local storage mock
        await page.evaluateOnNewDocument(() => {
            global.localStorage = new LocalStorageMock();
        });

        // Navigate to the calendar page
        const htmlPath = `file:${path.resolve(__dirname, '../journal/journal.html')}`;
        await page.goto(htmlPath);

        // Inject CSS and JS
        const cssContent = readFileSync(path.resolve(__dirname, '../journal/journal.css'), 'utf8');
        const jsContent = readFileSync(path.resolve(__dirname, '../journal/journal.js'), 'utf8');
        await page.addStyleTag({ content: cssContent });
        await page.addScriptTag({ content: jsContent });
    });

    afterAll(async () => {
      await browser.close();
    });

    it('Should display journal for current date', async () => {
      const pageDate = await page.$eval('#date', el => el.innerText);
      expect(pageDate).toBe(currDate.toDateString());
    });

    it('Make sure localstorage is empty', async () => {
      /*
      const sampleTask = { date: new Date().toISOString(), name: 'New Task', time: '2:00 PM', tag: 'Work', completed: false };
      await page.evaluate((task) => {
          const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
          tasks.push(task);
          localStorage.setItem('tasks', JSON.stringify(tasks));
      }, sampleTask);

      const storedTasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
      expect(storedTasks).toContainEqual(sampleTask);
      */
     /*
      const sampleTask = {
        name: 'Task 1',
        completed: false,
        date: currDate.toDateString(),
        time: '12:00 PM',
        difficulty: 'green',
        tag:
      };
      */
      const storedTasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
      expect(storedTasks).toBe(null);
    });
  });
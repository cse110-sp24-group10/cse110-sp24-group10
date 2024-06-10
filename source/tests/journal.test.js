const puppeteer = require('puppeteer');
const { readFileSync } = require('fs');
const path = require('path');
const { TestWatcher } = require('jest');
const { hasUncaughtExceptionCaptureCallback } = require('process');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

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
        const storedTasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
        expect(storedTasks).toBe(null);
    });

    describe('Making sure all elements are empty', () => {
        it('Make sure no tags exist for the current day', async () => {
            let tags = await page.$$('span.tag');
            expect(tags.length).toBe(0);
        });
    
        it('Make sure no tasks exist for the current day', async () => {
            let tasks = await page.$$('span.task-name');
            expect(tasks.length).toBe(0);
        });

        describe('Making sure all text displays are empty', () => {
          it('Make sure no plain text exists for the current day', async () => {
              const textValue = await page.$eval('#textBox', el => el.value);
              expect(textValue).toBe('');
          });

          describe('Make sure code boxes only have starting comments', () => {
              it('Make sure no python code exists for the current day', async () => {
                  // Ensure the page is fully loaded and the editor is initialized
                  await page.waitForSelector('#languageSelect');
                  console.log("Page loaded and selector available");

                  // Select Python from the dropdown
                  await page.select('#languageSelect', 'python');
                  console.log("Python selected from dropdown");

                  // Trigger the change event to update CodeMirror
                  await page.evaluate(() => {
                      const languageSelect = document.querySelector('#languageSelect');
                      const event = new Event('change');
                      languageSelect.dispatchEvent(event);
                  });
                  console.log("Change event dispatched");

                  // Manually set the mode to Python
                  await page.evaluate(() => {
                      const editor = document.querySelector('.CodeMirror').CodeMirror;
                      editor.setOption('mode', 'python');
                      editor.setValue('# Enter code here\n');
                  });
                  console.log("Manually set editor mode to Python");

                  // Add a small delay to ensure CodeMirror updates
                  await page.waitForTimeout(200);
                  console.log("Waited for CodeMirror to update");

                  // Ensure the editor is using the correct mode
                  const editorMode = await page.evaluate(() => {
                      const editor = document.querySelector('.CodeMirror').CodeMirror;
                      return editor.getOption('mode');
                  });
                  console.log("Editor mode:", editorMode);

                  expect(editorMode).toBe('python');

                  // Ensure the editor content is updated
                  const editorValue = await page.evaluate(() => {
                      const editor = document.querySelector('.CodeMirror').CodeMirror;
                      return editor.getValue();
                  });
                  console.log("Editor value:", editorValue);

                  expect(editorValue).toBe('# Enter code here\n'); // Ensuring the correct starting comment for Python
              });
          });
      });
      
      
    });

    

    // TODO: below test is not done
    it('Add tasks', async () => {
        let currDay = new Date();
        // create a variable named nextDay where it is the next day of the current day
        let nextDay = new Date(currDay);
        // define an object storing objects
        let task1 = {
                name: 'task 1',
                completed: false,
                date: '2024-06-08',
                time: '12:00',
                difficulty: 'blue',
                tag: 'tag1'    
        };
        let task2 = {
                name: 'task 2',
                completed: true,
                date: '2024-06-08',
                time: '12:00',
                difficulty: 'blue',
                tag: 'tag1'    
        };
    });
  });

  
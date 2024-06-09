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
            it('Make sure no plain text exist for the current day', async () => {
                const textValue = await page.$eval('#textBox', el => el.value);
                expect(textValue).toBe('');
            });
            
            /* XXX: FIX 
            describe('Make sure code boxes only have starting comments', () => {
                it('Make sure no python code exist for the current day', async () => {
                    await page.select('#languageSelect', 'python'); // selecting language from the dropdown
                    await page.evaluate(() => { // firing event listener just to be sure
                        let event = new Event('change');
                        document.querySelector('#languageSelect').dispatchEvent(event);
                    });
                    
                    const selectedValue = await page.$eval('#languageSelect', el => el.value); // grabbing selected value
                    console.log(selectedValue); // when i ran, python was output (correct)

                    const divHTML = await page.$eval('#editor', el => el.innerHTML); // best way i found to get the properties of a codemirror instance, could probably be better
                    console.log(divHTML);

                    // some shit to parse the text value of the html
                    let dom = new JSDOM(divHTML);
                    let document = dom.window.document;
                    let pythonCode = document.querySelector('.cm-comment').textContent;

                    expect(pythonCode).toBe('# Enter code here\n'); // output is '// Enter code here\n' which could be js/cpp but probably js since its the default
                });
            });
            */
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

  
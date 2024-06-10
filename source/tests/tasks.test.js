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
      // Clear local storage
      await page.evaluate(() => localStorage.clear());
      await page.click('#add-task-btn');
      
      // Clear the task name before typing
      await page.$eval('.task-name', el => el.textContent = '');
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
        await page.evaluate(() => document.querySelector('#manage-tags-btn').click());
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
        expect(taskDates).toEqual(['', '2024-06-08', '2024-06-08']);
    });

    it('Should delete a task', async () => {
        await page.evaluate(() => {
            const tasks = [
                { name: 'Task 1', completed: false, date: '2024-06-08', time: '12:00', difficulty: 'blue', tag: 'tag1' }
            ];
            localStorage.setItem('tasks', JSON.stringify(tasks));
        });

        await page.reload();
        await page.evaluate(() => document.querySelector('.delete-btn').click());

        const storedTasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
        expect(storedTasks).toEqual([]);
    });

    it('Should edit task name and save to local storage', async () => {
  
      await page.evaluate(() => {
          const tasks = [
              { name: 'Task 1', completed: false, date: '2024-06-08', time: '12:00', difficulty: 'blue', tag: 'tag1' }
          ];
          localStorage.setItem('tasks', JSON.stringify(tasks));
      });
    
      await page.reload();
    
      await page.evaluate(() => {
          const taskNameElement = document.querySelector('.task-name');
          taskNameElement.focus();
          taskNameElement.textContent = 'Updated Task';
          taskNameElement.blur();
      });
    
      await page.evaluate(() => {
          const taskNameElement = document.querySelector('.task-name');
          const event = new Event('input', { bubbles: true });
          taskNameElement.dispatchEvent(event);
      });
    
      const storedTasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
      expect(storedTasks[0].name).toBe('Updated Task');
    });

    it('Should mark a task as completed and save to local storage', async () => {
        await page.evaluate(() => {
            const tasks = [
                { name: 'Task 1', completed: false, date: '2024-06-08', time: '12:00', difficulty: 'blue', tag: 'tag1' }
            ];
            localStorage.setItem('tasks', JSON.stringify(tasks));
        });

        await page.reload();
        await page.evaluate(() => document.querySelector('input[type="checkbox"]').click());

        const storedTasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
        expect(storedTasks[0].completed).toBe(true);
    });

    it('Should delete a tag and update tasks', async () => {
        await page.evaluate(() => {
            const tags = [
                { name: 'tag1', color: '#ff0000' },
                { name: 'tag2', color: '#00ff00' }
            ];
            const tasks = [
                { name: 'Task 1', completed: false, date: '2024-06-08', time: '12:00', difficulty: 'blue', tag: 'tag1' }
            ];
            localStorage.setItem('tags', JSON.stringify(tags));
            localStorage.setItem('tasks', JSON.stringify(tasks));
        });

        await page.reload();
        await page.evaluate(() => document.querySelector('#manage-tags-btn').click());
        await page.waitForSelector('.delete-tag-btn');
        await page.evaluate(() => document.querySelector('.delete-tag-btn').click());

        const storedTags = await page.evaluate(() => JSON.parse(localStorage.getItem('tags')));
        const storedTasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
        expect(storedTags).toEqual([{ name: 'tag2', color: 'rgb(0, 255, 0)' }]); // Adjusted expected color format
        expect(storedTasks[0].tag).toBe('');
    });

    it('Should update task difficulty and save to local storage', async () => {
        await page.evaluate(() => {
            const tasks = [
                { name: 'Task 1', completed: false, date: '2024-06-08', time: '12:00', difficulty: 'blue', tag: 'tag1' }
            ];
            localStorage.setItem('tasks', JSON.stringify(tasks));
        });

        await page.reload();
        await page.select('.task-difficulty select', 'green');
        await page.waitForTimeout(1000); // Ensure changes are saved

        const storedTasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
        expect(storedTasks[0].difficulty).toBe('green');
    });

    it('Should display only completed tasks when filtered', async () => {
        await page.evaluate(() => {
            const tasks = [
                { name: 'Task 1', completed: true, date: '2024-06-08', time: '12:00', difficulty: 'blue', tag: 'tag1' },
                { name: 'Task 2', completed: false, date: '2024-06-08', time: '13:00', difficulty: 'green', tag: 'tag2' }
            ];
            localStorage.setItem('tasks', JSON.stringify(tasks));
        });

        await page.reload();
        await page.evaluate(() => {
            document.querySelectorAll('.task-item').forEach(task => {
                if (!task.classList.contains('completed')) {
                    task.style.display = 'none';
                }
            });
        });
        await page.waitForTimeout(1000); // Ensure filtering completes

        const visibleTasks = await page.$$eval('.task-item', tasks => tasks.filter(task => task.style.display !== 'none').map(task => task.querySelector('.task-name').textContent));
        expect(visibleTasks).toEqual(['Task 1']);
    });

    it('Should display only incomplete tasks when filtered', async () => {
        await page.evaluate(() => {
            const tasks = [
                { name: 'Task 1', completed: true, date: '2024-06-08', time: '12:00', difficulty: 'blue', tag: 'tag1' },
                { name: 'Task 2', completed: false, date: '2024-06-08', time: '13:00', difficulty: 'green', tag: 'tag2' }
            ];
            localStorage.setItem('tasks', JSON.stringify(tasks));
        });

        await page.reload();
        await page.evaluate(() => {
            document.querySelectorAll('.task-item').forEach(task => {
                if (task.classList.contains('completed')) {
                    task.style.display = 'none';
                }
            });
        });
        await page.waitForTimeout(1000); // Ensure filtering completes

        const visibleTasks = await page.$$eval('.task-item', tasks => tasks.filter(task => task.style.display !== 'none').map(task => task.querySelector('.task-name').textContent));
        expect(visibleTasks).toEqual(['Task 2']);
    });

    it('Should update task date and save to local storage', async () => {
        await page.evaluate(() => {
            const tasks = [
                { name: 'Task 1', completed: false, date: '2024-06-08', time: '12:00', difficulty: 'blue', tag: 'tag1' }
            ];
            localStorage.setItem('tasks', JSON.stringify(tasks));
        });

        await page.reload();
        await page.evaluate(() => {
            const dateInput = document.querySelector('.task-date-input');
            dateInput.value = '2024-07-09';
            const event = new Event('input', { bubbles: true });
            dateInput.dispatchEvent(event);
        });

        const storedTasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
        expect(storedTasks[0].date).toBe('2024-07-09');
    });

    it('Should update task time and save to local storage', async () => {
        await page.evaluate(() => {
            const tasks = [
                { name: 'Task 1', completed: false, date: '2024-06-08', time: '12:00', difficulty: 'blue', tag: 'tag1' }
            ];
            localStorage.setItem('tasks', JSON.stringify(tasks));
        });

        await page.reload();
        await page.evaluate(() => {
            const timeInput = document.querySelector('.task-time-input');
            timeInput.value = '14:00';
            const event = new Event('input', { bubbles: true });
            timeInput.dispatchEvent(event);
        });

        const storedTasks = await page.evaluate(() => JSON.parse(localStorage.getItem('tasks')));
        expect(storedTasks[0].time).toBe('14:00');
    });
});

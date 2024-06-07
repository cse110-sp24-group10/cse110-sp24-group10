class BottomBar extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
          <style>
          footer {
              position: fixed;
              left: 0;
              bottom: 0;
              width: 100%;
              background-color: var(--palette-dark-brown);
              padding-top: 0.4%;
              padding-bottom: 1.5%;
              z-index: 10;
          }

          .bottom-bar {
              margin-top: 20px;
              display: flex;
              justify-content: space-evenly;
              z-index: 10;
          }

          .bottom-bar button {
            padding: 10px 5%;
            font-size: 1em;
            cursor: pointer;
            border: 1px solid #000;
            border-radius: 10px 10px 0 0; /* Top left and right corners are round, bottom left and right corners are sharp */
            background-color: #654321;
            color: #fff;
            font-family: 'Courier Prime', monospace;
            transition: margin-top 0.4s ease, padding 0.4s ease, background-color 0.4s ease;
            position: relative;
            overflow: hidden;
        }

          .bottom-bar button span {
              display: inline-block;
              transition: transform 0.4s ease;
          }

          .bottom-bar button:hover {
              margin-top: -10px; /* Move the button up */
              padding-top: 15px; /* Adjust padding to create the illusion of button growing */
              padding-bottom: 15px;
              background-color: #dbc2a0;
              color: #654321;
              border: none;
              cursor: pointer;
          }

          .bottom-bar button:hover span {
              transform: translateY(-5px); /* Adjust text position */
          }
          
          </style>
          <footer>
              <div class="bottom-bar">
                  <button id="calendar-button"><span>Calendar</span></button>
                  <button id="task-list-button"><span>Task List</span></button>
                  <button id="journal-button"><span>Journal</span></button>
              </div>
          </footer>
      `;

      this.shadowRoot.getElementById('calendar-button').addEventListener('click', () => {
          window.location.href = '../calendar/calendar.html';
      });

      this.shadowRoot.getElementById('task-list-button').addEventListener('click', () => {
          window.location.href = '../tasks/tasks.html';
      });

      this.shadowRoot.getElementById('journal-button').addEventListener('click', () => {
          window.location.href = '../journal/journal.html';
      });
  }
}

customElements.define('bottom-bar', BottomBar);

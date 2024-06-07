class BottomBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
            footer {
                position: fixed;
                left:0;
                bottom: 0;
                overflow: hidden;
                width: 100%;
                background-color: var(--palette-dark-brown);
                padding-top: 0.4%;
                padding-bottom:1.5%;
                padding-left: auto;
                z-index: 10;
            }


            /* Spacing the buttons out */
            .bottom-bar {
                margin-top: 20px;
                display: flex;
                justify-content: space-evenly;
                z-index: 10;
            }


            /* Bottom but styling */
            .bottom-bar button {
                padding: 10px 5%;
                font-size: 1em;
                cursor: pointer;
                border: 1px solid #ccc;
                border-radius: 10px;
                background-color: #e1e1e1;
                font-family: 'Courier Prime', monospace;
            }
            .bottom-bar a {
                text-decoration: none;
            }
            </style>
            <footer>
            <div class="bottom-bar">
                
                <button id="calendar-button"> Calendar </button>
                <button id="task-list-button"> Task List </button>
                <button id="journal-button"> Journal </button>
            
            </div>
            </footer>
            <footer></footer>
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
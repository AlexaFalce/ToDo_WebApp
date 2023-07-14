# TODO-LIST WEB APPLICATION

development of a reusable board component with the Svelte framework for displaying a board of issues.



## Requirements

• display a list of boards

• display a list of issues associated with a board

• display the details of the issue by clicking on it

• search the displayed issues by title and/or type (TASK, BUG, USER STORY)

• create a new issue on the selected board 

• update issue status via drag & drop

• must be able to work with local data (search, create and update persisted on localStorage) 

• must be able to work with remotely retrieved data (search, create and update using backend)

• coponent board reusable and configurable by the developer

• handle the click on an issue with its own function passed as a parameter to the component



## Demo

Four board components are shown:
1. component with list of boards and issues managed remotely with search bar not visible and when clicking on the issue it shows the title; 
2. component with list of boards and issues managed remotely with search bar visible and on clicking on the issue shows the description; 
3. component with list of boards and issues managed locally with search bar visible and when clicking on the issue it shows all the information;
4. component with list of locally managed boards and issues with visible search bar and when clicking on the issue the ID is displayed;



## Getting started

After cloning the repository, run the following commands in bash:

npm install

npm run dev

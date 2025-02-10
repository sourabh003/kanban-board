# Kanban Board

A Trello-like kanban board project created using React + Vite. With Tailwind css for styling and Lucide react for the icons package.

### Folder structure

`public`

This folder contains all the public assets for the project like the logos, images, static files etc.

`src`

This folder contains all the source files for the project.

`- components`
This folder contains all the custom components for the project.

`- styles`
This folder contains all the stylesheet which are either common or global in the entire project.

`- utils`
This folder contains all the utility or helper files like `constants` in this case.

`- services`
This folder contains all the service files seggregated according to their functionality. Like `todo.js` in this case, has all the service methods related to a todo.

### Running the project

To run the project, following commands needed to be executed in their particular order.

- `npm install`
- `npm run dev`

After this, the development server should start on [http://localhost:5432](http://localhost:5432)

### Implementation details

There isn't any complex design pattern or logic is used. The project currently uses basic array operations to manage the todos.

- `Sections` - we have multiple section like `pending`, `in progress`, `completed`. Currently, we only have these 3 sections, but the code is scalable. We can modify the logic to dyanmically add more sections.

- `Todos` - Every todo has a status `pending | inProgress | completed` which is co-relates with the id of the sections. And from a single todos array, we are pushing the todos in different sections based on their statuses.

### Scope for improvement

- Due to time constraint, I'm not handling the order of the todos. Whenver moving them to different sections, it comes on top of all others. But this can be improved, we can track from the mouse position and add the todo on that particular position.

- Sections are static for now, but they can be made dyanmic.

- Right now most of the logic is written in the Sections component, but they can be seggregated further and the code can be more cleaner.

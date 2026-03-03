# SPA vs. MVC Architecture

## Traditional MVC (Server-Side Rendering)
1. **Request**: Browser requests `/users`.
2. **Server**: Controller fetches data from DB.
3. **Template**: Server renders a full HTML string using a template engine (Jinja2, Thymeleaf).
4. **Response**: Server sends the entire HTML document to the browser.
5. **Interaction**: Clicking a link repeats the whole process (full page reload).

## Modern SPA (Single Page Application)
1. **Initial Load**: Browser downloads a minimal HTML shell and a large JavaScript bundle.
2. **Bootstrapping**: JavaScript takes over the DOM.
3. **Routing**: Clicking `/users` doesn't hit the server for HTML. The client-side router catches the event.
4. **Data Fetching**: The frontend makes an AJAX/Fetch call to a JSON API (`GET /api/users`).
5. **Rendering**: The frontend framework (React/Vue) updates only the necessary part of the DOM tree with the new JSON data.
6. **Persistence**: The state remains in memory as the user navigates.

### Key Shift for Backend Engineers
In an SPA, the **frontend is a distributed system client**. It handles its own routing, state management, and view logic. The backend's role shifts primarily to providing a secure, performant JSON/GraphQL API.

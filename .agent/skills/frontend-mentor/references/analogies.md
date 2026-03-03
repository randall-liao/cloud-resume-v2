# Backend to Frontend Analogies

| Backend Concept | Frontend Equivalent | Explanation |
| :--- | :--- | :--- |
| **Database (Postgres, Mongo)** | **State / Store (Redux, Zustand)** | The "Single Source of Truth" for the application's current data. |
| **API Controllers (FastAPI, Spring)** | **Client-side Router (React Router)** | Maps a URL path to a specific "Handler" (Component). |
| **Middlewares** | **Higher-Order Components / Hooks** | Logic that wraps or intercepts component rendering/behavior. |
| **Maven / pip / Gradle** | **npm / yarn / pnpm** | Dependency management and script execution. |
| **Environment Variables (.env)** | **Vite / Webpack env variables** | Configuration injected at build time (prefixed with `VITE_` in Vite). |
| **Server Logs** | **Browser Console** | Where debugging and diagnostic info is output. |
| **Microservices** | **Micro-frontends / Components** | Decoupled, reusable units of functionality. |
| **SQL Queries** | **DOM Selectors / GraphQL** | How you query the underlying data structure (the DOM tree). |

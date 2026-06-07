# Frontend Architecture Overview

## Component & Folder Architecture

```mermaid
flowchart TD
    Src[src/] --> Router[router/ index.tsx]
    Src --> Services[services/ API services]
    Src --> Types[types/ TypeScript interfaces]
    Src --> Components[components/ Shared App Shell & Protected Routes]
    Src --> Features[features/ Domain-Driven Features]

    Features --> Auth[auth/ auth UI & useAuthStore]
    Features --> Timer[timer/ timer page, useTimerStore & active recovery]
    Features --> Goals[goals/ list & update goal cards]
    Features --> Tasks[tasks/ task management within goals]
    Features --> Stats[stats/ graphs & heatmap grids]
    Features --> Community[community/ leaderboards, feeds & invitations]
    Features --> Profile[profile/ avatar & timezone settings]
    Features --> Theme[theme/ theme selector & useThemeStore]
```

MinuteMind Frontend adopts a domain-driven, feature-based architecture. Common routing, shared layouts, API clients, and TypeScript contracts are kept in centralized folders (`router`, `components`, `services`, `types`), while business domains are separated into dedicated directories inside `features`. Each feature packages its specific components, hooks, stores, and utilities, maintaining clear boundaries and high modularity.

---

## Request Lifecycle

```mermaid
flowchart LR
    Component[React Component] -->|Triggers Action| Hook[React Query / Mutation Hook]
    Hook -->|Invokes Service| Service[Service Layer - axios wrapper]
    Service -->|Uses Configured Client| Interceptor[Axios Request Interceptor]
    Interceptor -->|Adds Authorization header| API[Backend Spring Boot API]
    API -->|Responds| ResponseInterceptor[Axios Response Interceptor]
    ResponseInterceptor -->|Success / Cache Update| Hook
    Hook -->|Rerenders Component| Component
```

The request flow is designed around asynchronous queries and mutations:
1. **User Interaction**: Triggered from the UI.
2. **Hook Layer**: Component invokes a TanStack Query hook, which coordinates caching and states.
3. **Service Layer**: The hook invokes a method from a corresponding API service.
4. **Axios Interceptor**: Inject JWT access tokens into request headers.
5. **API Request**: Request hits the backend API.
6. **Response Processing**: The response or error is filtered through response interceptors (handling expiration, retries, and token rotations).
7. **Cache & Render**: If successful, TanStack Query updates the cached state, prompting a re-render.

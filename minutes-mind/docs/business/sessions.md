# Focus Sessions and Timer Synchronization

## Focus Session Lifecycle

```mermaid
flowchart TD
    Idle[Timer Idle] -->|Select Task & Click Start| RequestStart[POST /sessions/start]
    RequestStart -->|API Success| StartTimer[Timer Runs: RUNNING / BREAK]
    StartTimer -->|Every 30s| Heartbeat[PUT /sessions/id/heartbeat]
    StartTimer -->|Timer Hits 0 / Manual Stop| UserDecision{Decision}
    
    UserDecision -->|Save Progress| RequestComplete[POST /sessions/id/complete]
    UserDecision -->|Discard Progress| RequestDiscard[POST /sessions/id/discard]
    
    RequestComplete -->|Reset Store| Idle
    RequestDiscard -->|Reset Store| Idle
```

The Focus Session Lifecycle controls how user work segments are recorded. A session must always be linked to a Task (unless it is a local Break session). When started, the frontend transitions into the running state, initiating countdown ticks and periodically updating the backend. Upon completion or cancellation, the user can choose to log the actual focus minutes or discard them entirely.

---

## Work Session State Machine

```mermaid
stateDiagram-v2
    [*] --> ACTIVE : POST /sessions/start
    ACTIVE --> ACTIVE : Periodic Heartbeat Update
    ACTIVE --> COMPLETED : POST /sessions/id/complete
    ACTIVE --> DISCARDED : POST /sessions/id/discard
    ACTIVE --> ORPHANED : Heartbeat Timeout (Backend side)
    ORPHANED --> [*]
    COMPLETED --> [*]
    DISCARDED --> [*]
```

On the system side, the session progresses through these server-side states:
- **ACTIVE**: The session has been started and is actively receiving heartbeats.
- **COMPLETED**: The user finished the session and successfully stored the elapsed work minutes.
- **DISCARDED**: The user chose to cancel the session, removing the active record without saving minutes.
- **ORPHANED**: The user closed the window or lost connectivity, and no heartbeat was received within the server threshold.

---

## Session Management Flow

```mermaid
sequenceDiagram
    autonumber
    participant User as User / UI
    participant Store as Zustand Timer Store
    participant API as Axios / API Client
    participant Server as Spring Boot API

    User->>Store: Press Start (Task ID, Planned Mins)
    Store->>API: Call sessionService.start()
    API->>Server: POST /sessions/start
    Server-->>API: Response (sessionId, startedAt)
    API-->>Store: Hydrate state and endTime
    Store->>User: Display countdown (RUNNING)

    loop Every 30 seconds
        Store->>API: Call sessionService.heartbeat(sessionId, actualMinutes)
        API->>Server: PUT /sessions/sessionId/heartbeat
        Server-->>API: Confirm received
    end

    opt Page Reload (F5) / Recover Session
        User->>Store: Page Mount
        Store->>API: Call sessionService.current()
        API->>Server: GET /sessions/current
        Server-->>API: Active Session details
        API-->>Store: Hydrate timer & recalculate remaining time
    end

    User->>Store: Press Complete (actualMinutes, notes)
    Store->>API: Call sessionService.complete()
    API->>Server: POST /sessions/sessionId/complete
    Server-->>API: Save & close session
    API-->>Store: Reset store to IDLE, clear objective
    Store->>User: Return to Idle dashboard
```

The sequence above outlines client-server communication during an active focus session. The frontend is responsible for tracking elapsed seconds locally via `setInterval` ticks while notifying the backend every 30 seconds via heartbeat updates. If the tab is closed, `navigator.sendBeacon` sends a final heartbeat payload. Upon reload, `useSessionRecovery` checks for any active sessions and recalculates the countdown time remaining.

# Goals and Tasks Management

## Goal Lifecycle

```mermaid
flowchart TD
    Create[Create Goal: Title, Color, Target, Deadline] --> AddTasks[Add One or More Tasks]
    AddTasks --> LogSessions[Log Focus Sessions on Tasks]
    LogSessions --> UpdateProgress[Update totalLoggedMinutes & Progress %]
    UpdateProgress --> VerifyComplete{Is Target Met or Done manually?}
    VerifyComplete -->|Yes| Complete[Mark Goal as COMPLETED]
    VerifyComplete -->|No| LogSessions
    Complete --> Archive[Archive Goal]
```

Goal management allows users to break down their long-term productivity targets into specific categories. A goal has visual properties (color styling), target parameters (expected focus minutes), a timeframe (deadline), and collaboration attributes (whether it is shared with friends). The lifecycle progresses from initial creation to task planning, focus session execution, progress aggregation, and eventual completion or archiving.

---

## Goal State Machine

```mermaid
stateDiagram-v2
    [*] --> ACTIVE : Create Goal
    ACTIVE --> PAUSED : Pause Goal
    PAUSED --> ACTIVE : Resume Goal
    ACTIVE --> COMPLETED : Mark Completed / Target Met
    COMPLETED --> ARCHIVED : Archive Goal
    ACTIVE --> ARCHIVED : Archive Goal
    PAUSED --> ARCHIVED : Archive Goal
    ARCHIVED --> ACTIVE : Restore Goal
```

Goals can transition through multiple states to reflect their current status:
- **ACTIVE**: The goal is current, and users can log tasks and timer sessions against it.
- **PAUSED**: Logging is suspended, and the goal is temporarily placed on hold.
- **COMPLETED**: The target minutes have been reached, or the user manually marked it complete.
- **ARCHIVED**: The goal is hidden from active dashboard views but retained in history.

---

## Task State Machine

```mermaid
stateDiagram-v2
    [*] --> TODO : Create Task
    TODO --> IN_PROGRESS : Start Focus Session / Manual Update
    IN_PROGRESS --> TODO : Pause Focus Session / Reset Status
    IN_PROGRESS --> DONE : Mark Completed / Complete Focus Session
    TODO --> DONE : Manual Check
    DONE --> TODO : Reopen Task
```

Tasks represent the granular steps required to achieve a Goal. They carry estimated durations, track logged minutes, and transition as follows:
- **TODO**: The task is created and pending execution.
- **IN_PROGRESS**: Active focus sessions are currently being tracked or the user manually started working.
- **DONE**: The task is finished. Logging focus sessions can still occur but the progress is preserved.

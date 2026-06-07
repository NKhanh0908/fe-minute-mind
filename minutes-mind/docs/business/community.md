# Community and Shared Goals

## Shared Goal Workflow

```mermaid
flowchart TD
    CreateShared[Owner Creates Shared Goal] --> Invite[Invite Friend: POST /community/invitations]
    Invite --> InvitationPending[Invitation: PENDING]
    
    InvitationPending -->|Invitee Accepts| Accept[State: ACCEPTED]
    InvitationPending -->|Invitee Declines| Decline[State: DECLINED]
    InvitationPending -->|Owner Withdraws| Cancel[State: CANCELLED]
    
    Accept --> AddMember[Add to GoalMembers List]
    AddMember --> Collab[Members log focus sessions on Goal's tasks]
    Collab --> Aggregation[Aggregate progressPercent and logged minutes across members]
```

Shared Goals allow collaboration on high-level productivity targets. The creator of the goal acts as the Owner and can invite other followed users. Invited users receive a invitation notification. Once they accept, they become members of the goal, meaning their logged focus minutes on tasks within that goal contribute to the shared goal's cumulative progress indicators.

---

## Community Workflow

```mermaid
flowchart TD
    Search[Search Users: GET /users/search] --> Follow[Follow User: POST /users/id/follow]
    Follow --> FeedUpdate[Activity Feed: Logs sessions & badges of followed users]
    Follow --> Leaderboard[Daily Leaderboard: Rankings based on focus minutes]
```

MinuteMind's community system drives motivation through peer feedback and comparison:
1. **User Discovery & Following**: Users search for peers using email or name queries. Following a user enables access to their productivity feed and places them on the user's leaderboard.
2. **Activity Feed**: Automatically aggregates activities like completed focus sessions, achieved targets, and unlocked badges from followed users.
3. **Daily Leaderboard**: Ranks users and their friends by focus minutes accumulated today, creating clean gamified competition.

---

## Invitation State Machine

```mermaid
stateDiagram-v2
    [*] --> PENDING : Invite Member
    PENDING --> ACCEPTED : Invitee Accepts
    PENDING --> DECLINED : Invitee Declines
    PENDING --> CANCELLED : Owner Withdraws Invitation
    ACCEPTED --> [*]
    DECLINED --> [*]
    CANCELLED --> [*]
```

Goal invitations have a strict status lifecycle:
- **PENDING**: The invitation has been sent and is awaiting a response.
- **ACCEPTED**: The invitee accepted and is immediately added as a goal member.
- **DECLINED**: The invitee rejected the request.
- **CANCELLED**: The inviter cancelled the pending invitation before the invitee could respond.

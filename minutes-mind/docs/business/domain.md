# Domain and Business Rules

## Productivity Data Flow

```mermaid
flowchart TD
    Session[Focus Session Completed] --> API[Session Complete API Request]
    API --> StatsUpdate[Update Stats Summary & Daily Heatmap]
    API --> StreakCheck{Minutes >= Streak Threshold?}
    API --> BadgeCheck{Badge Criteria Checked}
    API --> LeaderboardUpdate[Update Daily Leaderboard]

    StreakCheck -->|Yes| IncrementStreak[Increment User Current Streak]
    StreakCheck -->|No| MaintainStreak[Keep Streak Intact]

    BadgeCheck -->|Criteria Met| UnlockBadge[Unlock Badge & Display Alert]
    BadgeCheck -->|Criteria Unmet| NoAction[No Action]
```

The productivity data flow defines how focus sessions trigger updates across the core domains of MinuteMind. When a focus session finishes, the application sends a completion payload (containing `actualMinutes`, `completedTask`, and `notes`) to the backend. The backend updates the total logged minutes, today's focus minutes, and active day statistics. In addition, the completed session alters the daily heatmap representation, adjusts the daily community leaderboard ranks, and acts as the trigger for updating streaks and evaluating gamification badges.

---

## Streak Calculation

```mermaid
flowchart TD
    DailyReset[Midnight Timezone Check] --> CheckActivity{Any Logged Minutes Today?}
    CheckActivity -->|Yes| CheckThreshold{Focus Minutes >= streakThresholdMinutes?}
    CheckActivity -->|No| BreakStreak[Reset Streak to 0]

    CheckThreshold -->|Yes| KeepStreak[Maintain or Increment Streak]
    CheckThreshold -->|No| BreakStreak
```

Streak tracking is calculated based on the user's custom `streakThresholdMinutes` preference (defined in their Profile settings, defaults to 25 minutes). 
- **Requirement**: A user must log at least their threshold minutes within a single calendar day (in their local timezone) to sustain or increment their streak.
- **Breakage**: If the user fails to log the threshold amount of focus minutes before midnight in their designated timezone, the current streak resets to 0.

---

## Badge Award System

```mermaid
flowchart TD
    StartCheck[Session Logged / Goal Completed] --> EvaluateCriteria{Check Badge Conditions}
    EvaluateCriteria -->|First Session| UnlockFirstSession[Award 'First Step' Badge]
    EvaluateCriteria -->|Streak Thresholds| UnlockStreak[Award Streak Badges: 3, 7, 30 days]
    EvaluateCriteria -->|Total Minutes Logged| UnlockTotalMinutes[Award Time Badges: 100, 1000, 5000 mins]
    EvaluateCriteria -->|Shared Goals Completed| UnlockSharedGoal[Award Community Badges]
    
    UnlockFirstSession --> GrantBadge[Apply Badge Code to User Profile]
    UnlockStreak --> GrantBadge
    UnlockTotalMinutes --> GrantBadge
    UnlockSharedGoal --> GrantBadge
```

The gamification system rewards users with badges categorized by rarity levels (`COMMON`, `RARE`, `EPIC`, `LEGENDARY`). The evaluation takes place automatically upon logging a session or completing a goal. Once a badge criteria is met, the backend links the badge code to the user profile, allowing the frontend to retrieve the list of earned badges and display them on the profile page.

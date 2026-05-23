// Backend wrapper from `com.be.minutemind.exception.ApiResponse`
export interface ApiResponse<T> {
  status: number
  code?: string
  message: string
  data: T
  timestamp: string
}

export interface UserResponse {
  id: number
  email: string
  name: string
  avatarUrl: string | null
  timezone: string
  streakThresholdMinutes: number
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: UserResponse
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export type GoalStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type SessionType = 'WORK' | 'BREAK'
export type TimerState = 'IDLE' | 'RUNNING' | 'PAUSED' | 'BREAK'

export interface GoalResponse {
  id: number
  title: string
  description: string | null
  color: string | null
  targetTotalMinutes: number | null
  deadline: string | null
  status: GoalStatus
  sortOrder: number
  isShared: boolean
  createdAt: string
  updatedAt: string
  totalLoggedMinutes: number
}

export interface GoalRequest {
  title: string
  description?: string | null
  color?: string | null
  targetTotalMinutes?: number | null
  deadline?: string | null
}

export interface TaskResponse {
  id: number
  goalId: number
  title: string
  description: string | null
  estimatedMinutes: number | null
  totalLoggedMinutes: number
  status: TaskStatus
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface TaskRequest {
  goalId: number
  title: string
  description?: string | null
  estimatedMinutes?: number | null
}

export interface SortOrderRequest {
  ids: number[]
}

export interface SessionStartRequest {
  taskId: number
  sessionType: SessionType
  plannedMinutes: number
}

export interface SessionCompleteRequest {
  actualMinutes: number
  completedTask: boolean
  notes?: string | null
}

export interface ActiveSessionResponse {
  sessionId: number
  taskId: number
  sessionType: SessionType
  plannedMinutes: number
  startedAt: string
  lastHeartbeatAt: string
}

export interface BadgeResponse {
  code: string
  name: string
  icon: string
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
}

export interface StatsSummaryResponse {
  todayMinutes: number
  totalMinutes: number
  currentStreak: number
  longestStreak: number
  totalActiveDays: number
}

export interface HeatmapResponse {
  date: string
  totalMinutes: number
}

export interface UpdateProfileRequest {
  name: string
  timezone?: string
  streakThresholdMinutes?: number
}

// ─── Community ────────────────────────────────────────────────────────────────

export interface LeaderboardResponse {
  userId: number
  name: string
  avatarUrl: string | null
  value: number   // phút focus hôm nay
  rank: number
}

export type GoalMemberRole = 'OWNER' | 'MEMBER'
export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED'

export interface GoalMemberResponse {
  userId: number
  name: string
  avatarUrl: string | null
  role: GoalMemberRole
  joinedAt: string
  todayMinutes: number
  totalMinutes: number
  progressPercent: number  // -1 nếu goal không có target
}

export interface GoalInvitationResponse {
  id: number
  goalId: number
  goalTitle: string | null
  inviterId: number
  inviterName: string | null
  inviterAvatarUrl: string | null
  inviteeId: number
  inviteeName: string | null
  status: InvitationStatus
  createdAt: string
  respondedAt: string | null
}

export interface InviteMemberRequest {
  inviteeId: number
}

export interface RespondInvitationRequest {
  accept: boolean
}

export interface UserSearchResponse {
  userId: number
  name: string
  avatarUrl: string | null
  isFollowing: boolean
}

export interface PublicProfileResponse {
  userId: number
  name: string
  avatarUrl: string | null
  isFollowing: boolean
  currentStreak: number
  longestStreak: number
  totalActiveDays: number
  totalWorkMinutes: number
  badges: BadgeResponse[]
}

export interface ActivityFeedResponse {
  id: number
  userId: number
  userName: string
  userAvatarUrl: string | null
  type: string
  timestamp: string
  content: string
}

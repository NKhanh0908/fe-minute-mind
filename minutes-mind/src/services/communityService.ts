import { api } from './api'
import type {
  ApiResponse,
  GoalInvitationResponse,
  GoalMemberResponse,
  InviteMemberRequest,
  LeaderboardResponse,
  RespondInvitationRequest,
  UserSearchResponse,
  PublicProfileResponse,
  ActivityFeedResponse,
} from '../types/api'

export const communityService = {
  // ─── Leaderboard ─────────────────────────────────────────────────────────
  leaderboard: {
    daily: async (): Promise<LeaderboardResponse[]> => {
      const res = await api.get<ApiResponse<LeaderboardResponse[]>>('/community/leaderboard/daily')
      return res.data.data
    },
  },

  // ─── Follow / Unfollow ───────────────────────────────────────────────────
  follow: async (followingId: number): Promise<void> => {
    await api.post(`/community/follow/${followingId}`)
  },

  unfollow: async (followingId: number): Promise<void> => {
    await api.delete(`/community/unfollow/${followingId}`)
  },

  // ─── Invitation inbox (lời mời gửi tới tôi) ──────────────────────────────
  invitations: {
    listMine: async (): Promise<GoalInvitationResponse[]> => {
      const res = await api.get<ApiResponse<GoalInvitationResponse[]>>('/community/invitations')
      return res.data.data
    },

    respond: async (invitationId: number, body: RespondInvitationRequest): Promise<void> => {
      await api.patch(`/community/invitations/${invitationId}`, body)
    },
  },

  // ─── Shared Goal ─────────────────────────────────────────────────────────
  sharedGoal: {
    enableSharing: async (goalId: number): Promise<void> => {
      await api.post(`/community/goals/${goalId}/share`)
    },

    getMembers: async (goalId: number): Promise<GoalMemberResponse[]> => {
      const res = await api.get<ApiResponse<GoalMemberResponse[]>>(`/community/goals/${goalId}/members`)
      return res.data.data
    },

    invite: async (goalId: number, body: InviteMemberRequest): Promise<void> => {
      await api.post(`/community/goals/${goalId}/invitations`, body)
    },

    cancelInvitation: async (goalId: number, invitationId: number): Promise<void> => {
      await api.delete(`/community/goals/${goalId}/invitations/${invitationId}`)
    },

    kickMember: async (goalId: number, memberId: number): Promise<void> => {
      await api.delete(`/community/goals/${goalId}/members/${memberId}`)
    },

    leave: async (goalId: number): Promise<void> => {
      await api.delete(`/community/goals/${goalId}/members/me`)
    },

    getPendingInvitations: async (goalId: number): Promise<GoalInvitationResponse[]> => {
      const res = await api.get<ApiResponse<GoalInvitationResponse[]>>(
        `/community/goals/${goalId}/invitations`,
      )
      return res.data.data
    },
  },

  // ─── Profile, Feed & Search ────────────────────────────────────────────────
  profile: {
    searchUsers: async (query: string): Promise<UserSearchResponse[]> => {
      if (!query.trim()) return []
      const res = await api.get<ApiResponse<UserSearchResponse[]>>(`/community/users/search?q=${encodeURIComponent(query)}`)
      return res.data.data
    },

    getPublicProfile: async (userId: number): Promise<PublicProfileResponse> => {
      const res = await api.get<ApiResponse<PublicProfileResponse>>(`/community/users/${userId}/profile`)
      return res.data.data
    },

    getFeed: async (): Promise<ActivityFeedResponse[]> => {
      const res = await api.get<ApiResponse<ActivityFeedResponse[]>>('/community/feed')
      return res.data.data
    },
  },
}

export interface Prompt {
  id: number
  title: string
  content: string
  score: number
  createdAt: string
  category: { id: number; name: string }
  author: { id: number; username: string }
  userVote?: 'up' | 'down' | null
}

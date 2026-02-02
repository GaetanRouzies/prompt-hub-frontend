export interface Prompt {
  id: number;
  title: string;
  content: string;
  /** Can be positive or negative */
  score: number;
  createdAt: string;
  /** Always populated by the API on all prompt responses (use category.id for category id) */
  category: { id: number; name: string };
}

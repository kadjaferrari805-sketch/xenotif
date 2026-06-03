export type ReviewType = 'platform' | 'product'

export interface Review {
  id: string
  type: ReviewType
  product_id: string | null
  user_id: string
  author_name: string
  rating: number
  comment: string
  locale: string
  hidden: boolean
  created_at: string
}

export type EligibilityReason = 'ok' | 'guest' | 'not_subscriber' | 'not_buyer' | 'invalid_product'

export interface Eligibility {
  eligible: boolean
  reason: EligibilityReason
  authorName?: string
  existing?: Pick<Review, 'rating' | 'comment'> | null
}

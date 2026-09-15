export type MaterialId = 'matte' | 'gold' | 'silver' | 'navy'

export interface CardConfig {
  /** Brand wordmark on the card front. */
  business: string
  /** Line under the wordmark on the card front. */
  tagline: string
  /** Person's name on the card reverse. */
  name: string
  /** Designation under the name. */
  title: string
  slug: string
  materialId: MaterialId
}

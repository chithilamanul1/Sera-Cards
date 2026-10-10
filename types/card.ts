export type MaterialId =
  | 'matte'
  | 'custom'
  | 'gold'
  | 'silver'
  | 'navy'
  | 'epic_white'
  | 'epic_black'
  | 'metal_black'
  | 'metal_silver'
  | 'premium_white'
  | 'premium_black'
  | 'metal_gold'
  | 'color_custom'


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

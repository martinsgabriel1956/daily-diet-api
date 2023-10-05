
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex';

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      avatar_url: string | null
      food_diet_percent: number
      session_id?: string
      total_registered_food: number
      total_registered_diets_food: number
      total_registered_outside_diets_food: number
      better_sequence_diets_food: number
    }
    diets: {
      id: string
      name: string
      description: string
      date: Date | string
      is_diet_or_not: boolean
      session_id: string
    }
  }
}

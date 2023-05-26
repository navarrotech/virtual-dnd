

export type State = {
  user: User,
  authorized: boolean
}

export type User = {
  id: string,
  name: string,
  first_name: string,
  last_name: string,
  email: string,
  photoURL?: string,
  preferences: UserPreferences,
  created: string
}

export type UserPreferences = {
  [key: string]: any
}

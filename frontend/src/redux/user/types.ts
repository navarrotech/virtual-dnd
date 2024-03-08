
export type RawUserSession = {
  authorized: boolean,
  user: User,
}

export type State = {
  user: User,
  authorized: boolean,
  friends: User[],
  friend_requests: User[],
  friendsMap: {
    [key: string]: User
  }
  friendsRequestsMap: {
    [key: string]: User
  }
}

export type MinimalUser = {
  id: string,
  first_name?: string,
  last_name?: string,
  friend_ids?: string[],
  email?: string,
  photoURL?: string,
  online?: boolean
}

export type User = {
  id: string,
  name?: string,
  first_name: string,
  last_name: string,
  online: boolean,
  friend_ids: string[],
  friend_req_ids: string[],
  friends?: User[],
  friend_reqs?: User[],
  email?: string,
  photoURL?: string,
  preferences: UserPreferences,
  created: string
}

export type UserPreferences = {
  [key: string]: any
}

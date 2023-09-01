export interface BasicPageParams {
  page: number
  count: number
}

export interface BasicFetchResult<T> {
  list: T[]
  total: number
}

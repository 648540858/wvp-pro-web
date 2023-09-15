export interface BasicPageParams {
  page: number
  count: number
}

export interface BasicFetchResult<T> {
  list: T[]
  total: number
}

export interface StreamInfo {
  app: string
  stream: string
  ip: string
  flv: string
  https_flv: string
  ws_flv: string
  wss_flv: string
  fmp4: string
  https_fmp4: string
  ws_fmp4: string
  wss_fmp4: string
  hls: string
  https_hls: string
  ws_hls: string
  wss_hls: string
  ts: string
  https_ts: string
  ws_ts: string
  wss_ts: string
  rtmp: string
  rtmps: string
  rtsp: string
  rtsps: string
  rtc: string
  rtcs: string
  mediaServerId: string
  tracks: any[]
  startTime: string
  endTime: string
  progress: string
}

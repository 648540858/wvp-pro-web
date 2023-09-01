import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel'
/**
 * @description: 查询Device列表的参数
 */
export type DeviceListParams = BasicPageParams

export interface Device {
  deviceId: string
  name: string
  manufacturer: string
  model: string
  firmware: string
  transport: string
  streamMode: string
  hostAddress: string
  onLine: boolean
  registerTime: string
  keepaliveTime: string
  createTime: string
  updateTime: string
  charset: string
  subscribeCycleForCatalog: number
  subscribeCycleForMobilePosition: number
  subscribeCycleForAlarm: number
  keepaliveIntervalTime: string
  channelCount: number
  expires: number
  ssrcCheck: boolean
  geoCoordSys: string
  password: string
  sdpIp: string
  asMessageChannel: boolean
}

/**
 * @description: 设备列表的查询结果
 */
export type DeviceListResultModel = BasicFetchResult<Device>

/**
 * @description: 查询Device列表的参数
 */
export interface DeviceChannelListParams extends BasicPageParams {
  query: string | null | undefined
  online: boolean | null | undefined
  channelType: boolean | null | undefined
  catalogUnderDevice: boolean | null | undefined
}

export interface DeviceChannel {
  id: number
  channelId: string
  deviceId: string
  name: string
  manufacturer: string
  model: string
  owner: string
  civilCode: string
  block: string
  address: string
  parental: number
  parentId: string
  safetyWay: number
  registerWay: number
  secrecy: string
  ipAddress: string
  port: number
  password: string
  ptzType: number
  ptzTypeText: number
  createTime: string
  updateTime: string
  status: boolean
  longitude: number
  latitude: number
  longitudeGcj02: number
  latitudeGcj02: number
  longitudeWgs84: number
  latitudeWgs84: number
  subCount: number
  streamId: string
  hasAudio: boolean
  channelType: number
  businessGroupId: string
  gpsTime: string
}

/**
 * @description: 通道列表的查询结果
 */
export type DeviceChannelListResultModel = BasicFetchResult<DeviceChannel>

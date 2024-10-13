import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel'
import { TableProps } from 'ant-design-vue/lib/vc-table/Table'
/**
 * @description: 查询Device列表的参数
 */
export interface DeviceListParams extends BasicPageParams {
  query: string | null | undefined
  status: string | null | undefined
}

// 此处报错是因为TableProps里定义ID字段且类型为string
export interface Device extends TableProps {
  deviceId: string
  name: string
  manufacturer: string
  model: string
  firmware: string
  mediaServerId: string
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
  mobilePositionSubmissionInterval: number
  switchPrimarySubStream: boolean
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
  online: string | null | undefined
  channelType: string | null | undefined
  catalogUnderDevice: string | null | undefined
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

export interface PresetItem {
  presetId: number
  presetName: string
}

export interface ResetAlarmParam {
  deviceId: string
  alarmMethod: number
  alarmType: number
}

/**
 * @description: 通道列表的查询结果
 */
export type DeviceChannelListResultModel = BasicFetchResult<DeviceChannel>

export interface SyncStatus {
  total: number
  current: number
  errorMsg: string
  syncIng: boolean
}
export interface RecordInfo {
  deviceId: string
  channelId: string
  sn: string
  name: string
  sumNum: number
  count: number
  recordList: RecordItem[]
}
export interface RecordItem {
  deviceId: string
  name: string
  filePath: string
  fileSize: string
  address: string
  startTime: string
  endTime: string
  recorderId: string
}

/**
 * @description: 通道同步状态
 */
export type SyncStatusResultModel = SyncStatus

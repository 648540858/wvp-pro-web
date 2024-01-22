import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel'
import { TableProps as RcTableProps } from 'ant-design-vue/lib/vc-table/Table'

export interface PlatformModel extends RcTableProps {
  //  名称
  name: string
  //  是否启用
  enable: boolean
  // SIP服务国标编码
  serverGBId: string
  // SIP服务国标域
  serverGBDomain: string
  // SIP服务IP
  serverIP: string
  // SIP服务端口
  serverPort: number
  // 设备国标编号
  deviceGBId: string
  // 设备ip
  deviceIp: string
  // 设备端口
  devicePort: number
  // SIP认证用户名
  username: string
  // SIP认证密码
  password: string
  // 注册周期
  expires: number
  // 心跳周期(秒)
  keepTimeout: number
  // 传输协议 UDP/TCP
  transport: string
  // 字符集
  characterSet: string
  // 允许云台控制
  ptz: boolean
  // RTCP流保活
  rtcp: boolean
  // 在线状态
  status?: boolean
  // 共享的通道数量
  channelCount?: number
  // 已被订阅目录信息
  catalogSubscribe?: boolean
  // 已被订阅报警信息
  alarmSubscribe?: boolean
  // 已被订阅移动位置信息
  mobilePositionSubscribe?: boolean
  // 点播未推流的设备时是否使用redis通知拉起
  startOfflinePush: boolean
  // 目录分组-每次向上级发送通道信息时单个包携带的通道数量，取值1,2,4,8
  catalogGroup: number
  // 是否作为消息通道
  asMessageChannel: boolean
  // 通道自动推送
  autoPushChannel: boolean
  // 是否共享所有通道
  shareAllChannel: boolean
  // 是否共享分组
  shareGroup: boolean
  // 是否共享区域
  shareRegion: boolean
}

export interface ServerInfo {
  deviceIp: string
  devicePort: number
  username: string
  password: string
}

export type PlatformModelResultModel = BasicFetchResult<PlatformModel>

export interface PlatformModelListParams extends BasicPageParams {
  query: string | null | undefined
  enable: string | null | undefined
  online: string | null | undefined
}

import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel'
import { TableProps as RcTableProps } from 'ant-design-vue/lib/vc-table/Table'

export interface PushModel extends RcTableProps {
  //  名称
  name?: string
  //  应用名
  app: string
  // 流id
  stream: string
  // 使用的流媒体ID
  mediaServerId?: string
  // 使用的服务ID
  serverId?: string
  // 推流时间
  pushTime?: string
  // 是否正在推流
  pushIng?: boolean
  // 是否自己平台的推流
  self?: boolean
  // 国标ID
  gbId: string
  // 经度
  longitude: number
  // 纬度
  latitude: number
  // 状态
  status?: boolean
}

export type PushListResultModel = BasicFetchResult<PushModel>

export interface PushListParams extends BasicPageParams {
  query: string | null | undefined
  pushing: string | null | undefined
  mediaServerId: string | null | undefined
}

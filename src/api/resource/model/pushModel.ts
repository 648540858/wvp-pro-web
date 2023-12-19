import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel'
import { TableProps as RcTableProps } from 'ant-design-vue/lib/vc-table/Table'

export interface PushModel extends RcTableProps {
  //  应用名
  app: String
  // 流id
  stream: string
  // 观看总人数
  totalReaderCount: string
  // 产生源类型的字符串描述
  originTypeStr: string
  // 产生源的url
  originUrl: string
  // 存活时间，单位秒
  aliveSecond: string
  // 使用的流媒体ID
  mediaServerId: string
  // 推流时间
  pushTime: string
  // 是否正在推流
  pushIng: boolean
  // 是否自己平台的推流
  self: boolean
}

export type PushListResultModel = BasicFetchResult<PushModel>

export interface PushListParams extends BasicPageParams {
  query: string | null | undefined
  pushing: boolean | null | undefined
  mediaServerId: string | null | undefined
}

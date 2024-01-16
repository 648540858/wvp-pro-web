import { BasicFetchResult, BasicPageParams } from '/@/api/model/baseModel'
import { TableProps as RcTableProps } from 'ant-design-vue/lib/vc-table/Table'

export interface Log extends RcTableProps {
  name: string
  commonGbName: string
  type: string
  uri: string
  address: string
  result: string
  timing: number
  username: string
  createTime: string
}

export type LogListResultModel = BasicFetchResult<Log>

export interface LogListParams extends BasicPageParams {
  query?: string | null | undefined
  type?: string | null | undefined
  startTime?: string | null | undefined
  endTime?: string | null | undefined
  result?: string | null | undefined
}

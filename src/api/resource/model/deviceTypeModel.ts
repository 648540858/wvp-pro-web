import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel'
import { TableProps as RcTableProps } from 'ant-design-vue/lib/vc-table/Table'

export interface DeviceType extends RcTableProps {
  // 编号
  code: string
  // 名称
  name: string
  // 归属名称
  ownerName: string
}

export type DeviceTypeListResultModel = BasicFetchResult<DeviceType>

export interface DeviceTypeListParams extends BasicPageParams {
  query: string | null | undefined
}

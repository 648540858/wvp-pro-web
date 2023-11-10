import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel'
import { TableProps as RcTableProps } from 'ant-design-vue/lib/vc-table/Table'

export interface NetworkIdentificationType extends RcTableProps {
  // 编号
  code: string
  // 名称
  name: string
}

export type NetworkIdentificationTypeListResultModel = BasicFetchResult<NetworkIdentificationType>

export interface NetworkIdentificationTypeTypeListParams extends BasicPageParams {
  query: string | null | undefined
}

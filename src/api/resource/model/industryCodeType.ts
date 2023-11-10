import { BasicFetchResult } from '/@/api/model/baseModel'
import { TableProps as RcTableProps } from 'ant-design-vue/lib/vc-table/Table'

export interface IndustryCodeType extends RcTableProps {
  // 接入类型码
  code: string
  // 名称
  name: string
  // 备注
  notes: string
}

export type IndustryCodeListResultModel = BasicFetchResult<IndustryCodeType>

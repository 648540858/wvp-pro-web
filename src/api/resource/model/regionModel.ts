import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel'
import { TableProps as RcTableProps } from 'ant-design-vue/lib/vc-table/Table'

export interface Region extends RcTableProps {
  // 数据库自增ID
  commonRegionId: number
  // 区域国标编号
  commonRegionDeviceId: string
  // 区域名称
  commonRegionName: string
  // 父区域国标ID
  commonRegionParentId: string
}

export type RegionListResultModel = BasicFetchResult<Region>

export interface RegionListParams extends BasicPageParams {
  query: string | null | undefined
}

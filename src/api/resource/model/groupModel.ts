import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel'
import { TableProps as RcTableProps } from 'ant-design-vue/lib/vc-table/Table'

export interface Group extends RcTableProps {
  // 数据库自增ID
  commonGroupId: number
  // 分组国标编号
  commonGroupDeviceId: string
  // 分组名称
  commonGroupName: string
  // 分组父ID
  commonGroupParentId: string
  // 分组的顶级节点ID，对应多个虚拟组织的业务分组ID
  commonGroupTopId: string
}

export type GroupListResultModel = BasicFetchResult<Group>

export interface GroupListParams extends BasicPageParams {
  query: string | null | undefined
}

export interface ChildGroupListParams extends BasicPageParams {
  groupParentId: string | null | undefined
}

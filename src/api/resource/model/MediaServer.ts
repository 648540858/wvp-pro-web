import { TableProps as RcTableProps } from 'ant-design-vue/lib/vc-table/Table'

export interface MediaServer extends RcTableProps {
  id: string
  ip: string
}

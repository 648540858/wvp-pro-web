import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel'
import { TableProps as RcTableProps } from 'ant-design-vue/lib/vc-table/Table'

export interface CloudRecordItem extends RcTableProps {
  // 数据库自增ID
  id: number
  // 应用名
  app: string
  // 流
  stream: string
  // 鉴权ID
  callId: string
  // 开始时间
  startTime: number
  // 结束时间
  endTime: number
  // ZLM Id
  mediaServerId: string
  // 文件名称
  fileName: string
  // 文件路径
  filePath: string
  // 文件夹
  folder: string
  // 收藏
  collect: boolean
  // 文件大小
  fileSize: number
  // 文件时长
  timeLen: number
}

export type CloudRecordListResultModel = BasicFetchResult<CloudRecordItem>

export interface CloudRecordListParams extends BasicPageParams {
  query: string | null | undefined
}

export interface ChildGroupListParams extends BasicPageParams {
  groupParentId: string | null | undefined
}

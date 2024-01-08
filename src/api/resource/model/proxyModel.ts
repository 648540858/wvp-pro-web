import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel'
import { TableProps as RcTableProps } from 'ant-design-vue/lib/vc-table/Table'

export interface ProxyModel extends RcTableProps {
  //  类型
  type: string
  //  名称
  name?: string
  //  应用名
  app: string
  // 流id
  stream: string
  // 使用的流媒体ID
  mediaServerId?: string
  // ffmpeg模板KEY
  ffmpegCmdKey?: string
  // 目标地址
  url: string
  // 使用的服务ID
  dstUrl: string
  // 创建时间
  createTime?: string
  // 是否启用
  enable: boolean
  // 是否启用音频
  enableAudio: boolean
  // 是否录制
  enableMp4: boolean
  // 是否 无人观看时删除
  enableRemoveNoneReader: boolean
  // 是否 无人观看时自动停用
  enableDisableNoneReader: boolean
  // 国标ID
  gbId: string
  // 经度
  longitude: number
  // 纬度
  latitude: number
  // 状态
  status?: boolean
  // 代理失败的原因
  proxyError?: string
}

export type ProxyListResultModel = BasicFetchResult<ProxyModel>

export interface ProxyListParams extends BasicPageParams {
  query: string | null | undefined
  online: boolean | null | undefined
}

import { defHttp } from '/@/utils/http/axios'
import { LogListParams, LogListResultModel } from '/@/api/resource/model/log'

enum Api {
  // 查询分组下的通道
  LIST = '/api/log/all',
  DELETE = '/api/log/delete',
  CLEAR = '/api/log/clear',
}

export const queryLogListApi = (params: LogListParams) =>
  defHttp.get<LogListResultModel>({
    url: Api.LIST,
    params: params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const deleteLogApi = (id: number) =>
  defHttp.delete<void>({
    url: Api.DELETE,
    params: {
      id: id,
    },
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const clearLogApi = () =>
  defHttp.delete<void>({
    url: Api.CLEAR,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

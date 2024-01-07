import { defHttp } from '/@/utils/http/axios'
import { StreamInfo } from '/@/api/model/baseModel'
import {ProxyListParams, ProxyListResultModel, ProxyModel} from '/@/api/resource/model/proxyModel'

enum Api {
  // 获取所属的行政区划下的行政区划
  LIST = '/api/proxy/list',
  PLAY = '/api/proxy/getPlayUrl',
  STOP = '/api/proxy/stop',
  DELETE = '/api/proxy/delete',
  ADD = '/api/proxy/add',
  UPDATE = '/api/proxy/update',
  BATCH_DELETE = '/api/proxy/batchDelete',
}

export const queryProxyListApi = (param: ProxyListParams) =>
  defHttp.get<ProxyListResultModel>({
    url: Api.LIST,
    params: param,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const addPushApi = (proxyModel: ProxyModel) =>
  defHttp.post<void>({
    url: Api.ADD,
    params: proxyModel,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const playPushApi = (app: string, stream: string, mediaServerId: string) =>
  defHttp.get<StreamInfo>({
    url: Api.PLAY,
    params: {
      app: app,
      stream: stream,
      mediaServerId: mediaServerId,
    },
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const stopPushApi = (app: string, stream: string) =>
  defHttp.get<void>({
    url: Api.STOP,
    params: {
      app: app,
      stream: stream,
    },
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const updatePushApi = (pushModel: ProxyModel) =>
  defHttp.post<void>({
    url: Api.UPDATE,
    params: pushModel,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const deletePushApi = (id: number) =>
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
export const batchDeletePushApi = (streamPushIds: number[]) =>
  defHttp.delete<void>({
    url: Api.BATCH_DELETE,
    params: {
      streamPushIds: streamPushIds,
    },
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

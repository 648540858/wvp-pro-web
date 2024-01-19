import { defHttp } from '/@/utils/http/axios'
import { StreamInfo } from '/@/api/model/baseModel'
import {ProxyListParams, ProxyListResultModel, ProxyModel} from '/@/api/resource/model/proxyModel'

enum Api {
  // 获取所属的行政区划下的行政区划
  LIST = '/api/proxy/list',
  DEL = '/api/proxy/delete/id',
  STOP = '/api/proxy/stop',
  DELETE = '/api/proxy/delete',
  ADD = '/api/proxy/add',
  EDIT = '/api/proxy/edit',
  UPDATE = '/api/proxy/update',
  PLAY = '/api/proxy/play',
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
export const removeProxyApi = (id: number) =>
  defHttp.delete<void>({
    url: Api.DEL,
    params: {
      id: id,
    },
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const addProxyApi = (proxyModel: ProxyModel) =>
  defHttp.post<void>({
    url: Api.ADD,
    params: proxyModel,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const editProxyApi = (proxyModel: ProxyModel) =>
  defHttp.post<void>({
    url: Api.EDIT,
    params: proxyModel,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const playProxyApi = (id: number) =>
  defHttp.get<StreamInfo>({
    url: Api.PLAY,
    params: {
      id: id,
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

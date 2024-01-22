import { defHttp } from '/@/utils/http/axios'
import {PushListParams, PushListResultModel, PushModel} from '/@/api/resource/model/pushModel'
import { StreamInfo } from '/@/api/model/baseModel'

enum Api {
  // 获取所属的行政区划下的行政区划
  LIST = '/api/push/list',
  PLAY = '/api/push/getPlayUrl',
  STOP = '/api/push/stop',
  DELETE = '/api/push/delete',
  ADD = '/api/push/add',
  UPDATE = '/api/push/update',
  BATCH_DELETE = '/api/push/batchDelete',
  PREDICT_STREAM = '/api/push/predict',
}

export const queryPushListApi = (param: PushListParams) =>
  defHttp.get<PushListResultModel>({
    url: Api.LIST,
    params: param,
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
export const updatePushApi = (pushModel: PushModel) =>
  defHttp.post<void>({
    url: Api.UPDATE,
    params: pushModel,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const addPushApi = (pushModel: PushModel) =>
  defHttp.post<void>({
    url: Api.ADD,
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
export const predictStreamUrlApi = (pushModel: PushModel) =>
  defHttp.post<StreamInfo>({
    url: Api.PREDICT_STREAM,
    params: pushModel,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

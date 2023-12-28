import { defHttp } from '/@/utils/http/axios'
import { PushListParams, PushListResultModel } from '/@/api/resource/model/pushModel'
import { StreamInfo } from '/@/api/model/baseModel'

enum Api {
  // 获取所属的行政区划下的行政区划
  LIST = '/api/push/list',
  PLAY = '/api/push/getPlayUrl',
  STOP = '/api/push/stop',
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

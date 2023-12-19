import { defHttp } from '/@/utils/http/axios'
import { PushListParams, PushListResultModel } from '/@/api/resource/model/pushModel'

enum Api {
  // 获取所属的行政区划下的行政区划
  LIST = '/api/push/list',
}

export const queryList = (param: PushListParams) =>
  defHttp.get<PushListResultModel[]>({
    url: Api.LIST,
    params: param,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

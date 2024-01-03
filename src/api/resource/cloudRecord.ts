import { defHttp } from '/@/utils/http/axios'
import {
  Group,
  GroupListResultModel,
  GroupListParams,
  ChildGroupListParams,
} from '/@/api/resource/model/groupModel'

enum Api {
  ADD = '/api/group/add',
}

export const addGroupApi = (group: Group) =>
  defHttp.post<void>({
    url: Api.ADD,
    params: group,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

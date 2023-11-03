import { defHttp } from '/@/utils/http/axios'
import {
  Group,
  GroupListResultModel,
  GroupListParams,
  ChildGroupListParams,
} from '/@/api/resource/model/groupModel'

enum Api {
  ADD = '/api/group/add',
  LIST = '/api/group/list',
  UPDATE = '/api/group/update',
  DELETE = '/api/group/delete',
  QUERY_CHILD_GROUP_LIST = '/api/group/child/list',
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

export const queryGroupListApi = (params: GroupListParams) =>
  defHttp.get<GroupListResultModel>({
    url: Api.LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const updateGroupApi = (group: Group) =>
  defHttp.post<GroupListResultModel>({
    url: Api.UPDATE,
    params: group,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const deleteGroupApi = (groupDeviceId: string) =>
  defHttp.delete<void>({
    url: Api.DELETE,
    params: {
      groupDeviceId: groupDeviceId,
    },
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const queryChildGroupListApi = (params: ChildGroupListParams) =>
  defHttp.get<GroupListResultModel>({
    url: Api.QUERY_CHILD_GROUP_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

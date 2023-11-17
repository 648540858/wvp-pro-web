import { defHttp } from '/@/utils/http/axios'
import {
  ChildRegionListParams,
  Region,
  RegionListResultModel,
} from '/@/api/resource/model/regionModel'

enum Api {
  // 获取所属的行政区划下的行政区划
  QUERY_BASE_CHILD_LIST_IN_REGION = '/api/region/base/child/list',
  QUERY_CHILD_LIST_IN_REGION = '/api/region/child/list',
  UPDATE = '/api/region/update',
  DELETE = '/api/region/delete',
  ADD = '/api/region/add',
  QUERY_BY_DEVICE_ID = '/api/region/one',
}

export const queryChildList = (parent: string) =>
  defHttp.get<Region[]>({
    url: Api.QUERY_BASE_CHILD_LIST_IN_REGION,
    params: {
      parent: parent,
    },
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const queryChildRegionListApi = (params: ChildRegionListParams) =>
  defHttp.get<RegionListResultModel>({
    url: Api.QUERY_CHILD_LIST_IN_REGION,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const updateRegionApi = (region: Region) =>
  defHttp.post<void>({
    url: Api.UPDATE,
    params: region,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const deleteRegionApi = (regionDeviceId: string) =>
  defHttp.get<void>({
    url: Api.DELETE,
    params: {
      regionDeviceId,
    },
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const addRegionApi = (region: Region) =>
  defHttp.post<void>({
    url: Api.ADD,
    params: region,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const getRegionByDeviceIdApi = (regionDeviceId: string) =>
  defHttp.get<Region>({
    url: Api.QUERY_BY_DEVICE_ID,
    params: {
      regionDeviceId: regionDeviceId,
    },
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

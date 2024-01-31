import { defHttp } from '/@/utils/http/axios'
import {
  ChannelListForGroupParams,
  ChannelListResultModel,
  CommonGbChannel, PtzControlParam,
  ShareChannelListParams,
  ShareChannelModelListResultModel,
  ShareCommonGbChannelParam,
  UpdateCommonChannelToGroup,
  UpdateCommonChannelToRegion
} from '/@/api/resource/model/channelModel';
import { IndustryCodeType } from '/@/api/resource/model/industryCodeType'
import { DeviceType } from '/@/api/resource/model/deviceTypeModel'
import { NetworkIdentificationType } from '/@/api/resource/model/networkIdentificationTypeModel'

enum Api {
  // 查询分组下的通道
  LIST = '/api/channel/list',
  // 更新通道
  UPDATE = '/api/channel/update',
  // 查询所有的省
  QUERY_PROVINCE_LIST_IN_REGION = '/api/channel/region/province',
  // 查询省下的所有的市
  QUERY_CITY_LIST_IN_REGION = '/api/channel/region/city',
  // 查询市下的所有的县
  QUERY_COUNTY_LIST_IN_REGION = '/api/channel/region/county',
  // 查询行业编码列表
  QUERY_INDUSTRY_CODE_LIST = '/api/channel/industry/list',
  // 查询类型编码列表
  QUERY_TYPE_LIST = '/api/channel/type/list',
  // 查询类型编码列表
  QUERY_NETWORK_IDENTIFICATION_LIST = '/api/channel/network/identification/list',
  // 查询与分组相关的列表
  UPDATE_TO_GROUP = '/api/channel/group/update',
  // 移除分组信息
  REMOVE_FROM_GROUP = '/api/channel/group/remove',
  // 查询与区域相关的列表
  UPDATE_TO_REGION = '/api/channel/region/update',
  // 移除区域信息
  REMOVE_FROM_REGION = '/api/channel/region/remove',
  // 播放
  PLAY = '/api/channel/play',
  // 通道共享列表
  SHARE_LIST = '/api/channel/share/list',
  // 添加通道共享
  SHARE_ADD = '/api/channel/share/add',
  // 移除通道共享
  SHARE_REMOVE = '/api/channel/share/remove',
  // PTZ控制
  PTZ = '/api/channel/ptz',
}

export const queryChannelList = (params: ChannelListForGroupParams) =>
  defHttp.get<ChannelListResultModel>({
    url: Api.LIST,
    params: params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const updateApi = (commonGbChannel: CommonGbChannel) =>
  defHttp.post<void>({
    url: Api.UPDATE,
    params: commonGbChannel,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const playChannelApi = (channelDeviceId: string) =>
  defHttp.get<void>({
    url: Api.PLAY,
    params: {
      channelDeviceId: channelDeviceId,
    },
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const queryCityListInGroup = (province: string) =>
  defHttp.get<String[]>({
    url: Api.QUERY_CITY_LIST_IN_REGION,
    params: {
      province: province,
    },
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const queryCountyListInGroup = (city: string) =>
  defHttp.get<String[]>({
    url: Api.QUERY_COUNTY_LIST_IN_REGION,
    params: {
      city: city,
    },
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const queryIndustryCodeList = () =>
  defHttp.get<IndustryCodeType[]>({
    url: Api.QUERY_INDUSTRY_CODE_LIST,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const queryDeviceTypeList = () =>
  defHttp.get<DeviceType[]>({
    url: Api.QUERY_TYPE_LIST,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const queryNetworkIdentificationTypeList = () =>
  defHttp.get<NetworkIdentificationType[]>({
    url: Api.QUERY_NETWORK_IDENTIFICATION_LIST,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const updateToGroup = (params: UpdateCommonChannelToGroup) =>
  defHttp.post<void>({
    url: Api.UPDATE_TO_GROUP,
    params: params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const removeFromGroup = (params: UpdateCommonChannelToGroup) =>
  defHttp.post<void>({
    url: Api.REMOVE_FROM_GROUP,
    params: params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const updateToRegion = (params: UpdateCommonChannelToRegion) =>
  defHttp.post<void>({
    url: Api.UPDATE_TO_REGION,
    params: params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const removeFromRegion = (params: UpdateCommonChannelToRegion) =>
  defHttp.post<void>({
    url: Api.REMOVE_FROM_REGION,
    params: params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const queryShareChannelList = (params: ShareChannelListParams) =>
  defHttp.get<ShareChannelModelListResultModel>({
    url: Api.SHARE_LIST,
    params: params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const addShareChannelList = (params: ShareCommonGbChannelParam) =>
  defHttp.post<void>({
    url: Api.SHARE_ADD,
    params: params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const removeShareChannelList = (params: ShareCommonGbChannelParam) =>
  defHttp.delete<void>({
    url: Api.SHARE_REMOVE,
    params: params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const channelPtz = (params: PtzControlParam) =>
  defHttp.get<void>({
    url: Api.PTZ,
    params: params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const queryGbChannelApi = (id: number) =>
  defHttp.get<void>({
    url: Api.PTZ,
    params: params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

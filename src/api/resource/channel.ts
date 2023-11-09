import { defHttp } from '/@/utils/http/axios'
import { ChannelListResultModel } from '/@/api/resource/model/channelModel'

enum Api {
  // 查询分组下的通道
  QUERY_CHANNEL_LIST_IN_GROUP = '/api/channel/group/list',
  // 查询区域下的通道
  QUERY_CHANNEL_LIST_IN_REGION = '/api/channel/region/list',
  // 查询所有的省
  QUERY_PROVINCE_LIST_IN_REGION = '/api/channel/region/province',
  // 查询省下的所有的市
  QUERY_CITY_LIST_IN_REGION = '/api/channel/region/city',
  // 查询市下的所有的县
  QUERY_COUNTY_LIST_IN_REGION = '/api/channel/region/county',
}

export const queryChannelListInGroup = (
  groupDeviceId: string,
  query: string,
  page: number,
  count: number,
) =>
  defHttp.get<ChannelListResultModel>({
    url: Api.QUERY_CHANNEL_LIST_IN_GROUP,
    params: {
      groupDeviceId: groupDeviceId,
      query: query,
      page: page,
      count: count,
    },
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const queryProvinceListInGroup = () =>
  defHttp.get<String[]>({
    url: Api.QUERY_PROVINCE_LIST_IN_REGION,
    params: {},
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

import { defHttp } from '/@/utils/http/axios'
import { ChannelListResultModel } from '/@/api/resource/model/channelModel'

enum Api {
  // 查询分组下的通道
  QUERY_CHANNEL_LIST_IN_GROUP = '/api/channel/group/list',
  // 查询区域下的通道
  QUERY_CHANNEL_LIST_IN_REGION = '/api/channel/region/list',
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

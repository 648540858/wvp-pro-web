import { defHttp } from '/@/utils/http/axios'
import { Region } from '/@/api/resource/model/regionModel'

enum Api {
  // 获取所属的行政区划下的行政区划
  QUERY_COUNTY_LIST_IN_REGION = '/api/region/base/child/list',
}

export const queryChildList = (parent: string) =>
  defHttp.get<Region[]>({
    url: Api.QUERY_COUNTY_LIST_IN_REGION,
    params: {
      parent: parent,
    },
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })


import { defHttp } from '/@/utils/http/axios'
import {
  CloudRecordListParams,
  CloudRecordListResultModel,
} from '/@/api/cloudRecord/model/cloudRecordModel'

enum Api {
  LIST = '/api/cloud/record/list',
}

export const queryCloudRecordListApi = (params: CloudRecordListParams) =>
  defHttp.get<CloudRecordListResultModel>({
    url: Api.LIST,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
    params: params,
  })

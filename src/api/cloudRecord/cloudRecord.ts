import { defHttp } from '/@/utils/http/axios'
import {
  CloudRecordListParams,
  CloudRecordListResultModel,
} from '/@/api/cloudRecord/model/cloudRecordModel'
import { DownloadFileInfo, StreamInfo } from '/@/api/model/baseModel'

enum Api {
  LIST = '/api/cloud/record/list',
  PLAY_LIVE = '/api/cloud/record/play/live',
  DOWNLOAD_PATH = '/api/cloud/record/download/path',
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

export const getDownloadPathApi = (recordId: number) =>
  defHttp.get<DownloadFileInfo>({
    url: Api.DOWNLOAD_PATH,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
    params: {
      recordId: recordId,
    },
  })

export const getPlayLiveApi = (recordId: number) =>
  defHttp.get<StreamInfo>({
    url: Api.PLAY_LIVE,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
    params: {
      recordId: recordId,
    },
  })

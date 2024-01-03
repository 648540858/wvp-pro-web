import { defHttp } from '/@/utils/http/axios'
import {MediaServer} from "/@/api/mediaServer/model/MediaServer";

enum Api {
  ONLINE_LIST = '/api/server/media_server/online/list',
}

export const queryOnlineMediaServerListApi = () =>
  defHttp.get<MediaServer[]>({
    url: Api.ONLINE_LIST,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

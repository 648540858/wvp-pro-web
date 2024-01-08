import { defHttp } from '/@/utils/http/axios'
import { FFmpegCmdInfo, MediaServer} from '/@/api/mediaServer/model/MediaServer'

enum Api {
  ONLINE_LIST = '/api/server/media_server/online/list',
  FFMPEG_CMD_LIST = '/api/server/media_server/ffmpeg_cmd/list',
}

export const queryOnlineMediaServerListApi = () =>
  defHttp.get<MediaServer[]>({
    url: Api.ONLINE_LIST,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const queryFfmpegCMDListApi = (mediaServerId: string) =>
  defHttp.get<FFmpegCmdInfo[]>({
    url: Api.FFMPEG_CMD_LIST,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
    params: {
      mediaServerId: mediaServerId,
    },
  })

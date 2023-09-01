import { defHttp } from '/@/utils/http/axios'
import {
  DeviceListParams,
  DeviceListResultModel,
  DeviceChannelListParams,
  DeviceChannelListResultModel,
} from '/@/api/resource/model/gbResourceModel'

enum Api {
  DEVICE_LIST = '/api/device/query/devices',
  DEVICE_CHANNEL_LIST = '/api/device/query/devices/{deviceId}/channels',
}

/**
 * @description: 获取设备列表
 */

export const deviceListApi = (params: DeviceListParams) =>
  defHttp.get<DeviceListResultModel>({
    url: Api.DEVICE_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const deviceChannelListApi = (params: DeviceChannelListParams, deviceId: string) =>
  defHttp.get<DeviceChannelListResultModel>({
    url: Api.DEVICE_CHANNEL_LIST.replace('{deviceId}', deviceId),
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

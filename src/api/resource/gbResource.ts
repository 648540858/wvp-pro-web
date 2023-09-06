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
  DEVICE_CHANGE_TRANSPORT = '/api/device/query/transport/{deviceId}/{transport}',
  DEVICE_CHANGE_SYNC = '/api/device/query/${deviceId}/sync_status/',
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

export const changeDeviceStreamTransportApi = (deviceId: string, transport: string) =>
  defHttp.post<void>({
    url: Api.DEVICE_CHANGE_TRANSPORT.replace('{deviceId}', deviceId).replace(
      '{transport}',
      transport,
    ),
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

export const refreshChanelApi = (deviceId: string) =>
  defHttp.get<void>({
    url: Api.DEVICE_CHANGE_SYNC.replace('{deviceId}', deviceId),
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

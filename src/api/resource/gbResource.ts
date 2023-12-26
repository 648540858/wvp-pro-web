import { defHttp } from '/@/utils/http/axios'
import {
  DeviceListParams,
  DeviceListResultModel,
  DeviceChannelListParams,
  DeviceChannelListResultModel,
  SyncStatusResultModel,
  DeviceChannel,
  PresetItem,
  Device,
} from '/@/api/resource/model/gbResourceModel'
import { StreamInfo } from '/@/api/model/baseModel'

enum Api {
  DEVICE_LIST = '/api/device/query/device/list',
  DEVICE_DELETE = '/api/device/query/devices/{deviceId}/delete',
  DEVICE_UPDATE = '/api/device/query/device/update',
  DEVICE_ADD = '/api/device/query/device/add',
  DEVICE_CHANNEL_LIST = '/api/device/query/devices/{deviceId}/channels',
  DEVICE_SUB_CHANNEL_LIST = '/api/device/query/sub_channels/{deviceId}/{parentChannelId}/channels',
  DEVICE_CHANGE_TRANSPORT = '/api/device/query/transport/{deviceId}/{transport}',
  DEVICE_CHANGE_SYNC = '/api/device/query/devices/{deviceId}/sync/',
  DEVICE_CHANGE_SYNC_STATUS = '/api/device/query/{deviceId}/sync_status/',
  DEVICE_CHANGE_UPDATE = '/api/device/query/channel/update/{deviceId}',
  PLAY = '/api/play/start/{deviceId}/{channelId}',
  STOP_PLAY = '/api/play/stop/{deviceId}/{channelId}',
  GET_MEDIA_INFO = '/api/server/media_server/getMediaInfo',
  PTZ = '/api/ptz/control/{deviceId}/{channelId}',
  SYNC_28181 = '/api/channel/sync/device',
  PRESET_QUERY = '/api/ptz/preset/query/{deviceId}/{channelId}',
  PRESET_CONTROL = '/api/ptz/preset/control/{deviceId}/{channelId}',
  CRUISE_CONTROL = '/api/ptz/cruise/control/{deviceId}/{channelId}',
  SCAN_CONTROL = '/api/ptz/scan/control/{deviceId}/{channelId}',
  WIPER_CONTROL = '/api/ptz/wiper/control/{deviceId}/{channelId}',
  AUXILIARY_CONTROL = '/api/ptz/auxiliary/control/{deviceId}/{channelId}',
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

export const deviceSubChannelListApi = (
  params: DeviceChannelListParams,
  deviceId: string,
  parentChannelId: string,
) =>
  defHttp.get<DeviceChannelListResultModel>({
    url: Api.DEVICE_SUB_CHANNEL_LIST.replace('{deviceId}', deviceId).replace(
      '{parentChannelId}',
      parentChannelId,
    ),
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const refreshChanelApi = (deviceId: string) =>
  defHttp.get<SyncStatusResultModel>({
    url: Api.DEVICE_CHANGE_SYNC.replace('{deviceId}', deviceId),
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const refreshStatusChanelApi = (deviceId: string) =>
  defHttp.get<SyncStatusResultModel>({
    url: Api.DEVICE_CHANGE_SYNC_STATUS.replace('{deviceId}', deviceId),
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const deleteDeviceApi = (deviceId: string) =>
  defHttp.delete<void>({
    url: Api.DEVICE_DELETE.replace('{deviceId}', deviceId),
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const updateDeviceChannelApi = (channel: DeviceChannel) =>
  defHttp.post<void>({
    url: Api.DEVICE_CHANGE_UPDATE.replace('{deviceId}', channel.deviceId),
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
    params: channel,
  })

export const playApi = (channel: DeviceChannel) =>
  defHttp.get<StreamInfo>({
    url: Api.PLAY.replace('{deviceId}', channel.deviceId).replace('{channelId}', channel.channelId),
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const stopPlayApi = (channel: DeviceChannel) =>
  defHttp.get<StreamInfo>({
    url: Api.STOP_PLAY.replace('{deviceId}', channel.deviceId).replace(
      '{channelId}',
      channel.channelId,
    ),
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
export const getMediaInfoApi = (mediaServerId: string, app: string, stream: string) =>
  defHttp.get<any>({
    url: Api.GET_MEDIA_INFO,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
    params: {
      app: app,
      stream: stream,
      mediaServerId: mediaServerId,
    },
  })
export const ptzCameraApi = (
  deviceId: string,
  channelId: string,
  command: string,
  controlSpeed: number,
) =>
  defHttp.get<any>({
    url: Api.PTZ.replace('{deviceId}', deviceId).replace('{channelId}', channelId),
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
    params: {
      command: command,
      horizonSpeed: controlSpeed,
      verticalSpeed: controlSpeed,
      zoomSpeed: controlSpeed,
    },
  })

export const syncChannelFromGb28181Api = (
  deviceId: string,
  syncGroup: boolean,
  syncRegion: boolean,
  syncKeys: string,
) =>
  defHttp.get<any>({
    url: Api.SYNC_28181,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
    params: {
      deviceId: deviceId,
      syncGroup: syncGroup,
      syncRegion: syncRegion,
      syncKeys: syncKeys,
    },
  })

export const presetQueryApi = (deviceChannel: DeviceChannel) =>
  defHttp.get<PresetItem[]>({
    url: Api.PRESET_QUERY.replace('{deviceId}', deviceChannel.deviceId).replace(
      '{channelId}',
      deviceChannel.channelId,
    ),
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })

export const presetControlApi = (deviceChannel: DeviceChannel, command: string, presetId: number) =>
  defHttp.get<void>({
    url: Api.PRESET_CONTROL.replace('{deviceId}', deviceChannel.deviceId).replace(
      '{channelId}',
      deviceChannel.channelId,
    ),
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
    params: {
      command: command,
      presetId: presetId,
    },
  })

export const cruiseControlApi = (
  deviceChannel: DeviceChannel,
  cruiseId: number,
  command: string,
  presetId: number | undefined,
  speed: number | undefined,
  stay: number | undefined,
) =>
  defHttp.get<void>({
    url: Api.CRUISE_CONTROL.replace('{deviceId}', deviceChannel.deviceId).replace(
      '{channelId}',
      deviceChannel.channelId,
    ),
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
    params: {
      cruiseId: cruiseId,
      command: command,
      presetId: presetId,
      speed: speed,
      stay: stay,
    },
  })

export const scanControlApi = (
  deviceChannel: DeviceChannel,
  scanId: number,
  command: string,
  speed: number | undefined,
) =>
  defHttp.get<void>({
    url: Api.SCAN_CONTROL.replace('{deviceId}', deviceChannel.deviceId).replace(
      '{channelId}',
      deviceChannel.channelId,
    ),
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
    params: {
      scanId: scanId,
      command: command,
      speed: speed,
    },
  })

export const wiperControlApi = (deviceChannel: DeviceChannel, command: string) =>
  defHttp.get<void>({
    url: Api.WIPER_CONTROL.replace('{deviceId}', deviceChannel.deviceId).replace(
      '{channelId}',
      deviceChannel.channelId,
    ),
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
    params: {
      command: command,
    },
  })

export const auxiliaryControlApi = (
  deviceChannel: DeviceChannel,
  command: string,
  auxiliaryId: number,
) =>
  defHttp.get<void>({
    url: Api.AUXILIARY_CONTROL.replace('{deviceId}', deviceChannel.deviceId).replace(
      '{channelId}',
      deviceChannel.channelId,
    ),
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
    params: {
      command: command,
      auxiliaryId: auxiliaryId,
    },
  })

export const addDeviceApi = (device: Device) =>
  defHttp.post<void>({
    url: Api.DEVICE_ADD,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
    params: device,
  })

export const updateDeviceApi = (device: Device) =>
  defHttp.post<void>({
    url: Api.DEVICE_UPDATE,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
    params: device,
  })

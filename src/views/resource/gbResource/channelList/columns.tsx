import { ColumnsType } from 'ant-design-vue/lib/table/interface'

export function deviceChannelColumns(): ColumnsType {
  return [
    {
      title: '通道编号',
      dataIndex: 'channelId',
      fixed: 'left',
      width: 200,
    },
    {
      title: '设备编号',
      dataIndex: 'deviceId',
      fixed: 'left',
      width: 200,
    },
    {
      title: '通道名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '快照',
      dataIndex: 'snap',
      width: 200,
    },
    {
      title: '云台类型',
      dataIndex: 'PTZTypeText',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 150,
    },
    {
      title: '位置',
      dataIndex: 'coordinate',
      width: 150,
    },
    {
      title: '子设备数',
      dataIndex: 'subCount',
      width: 150,
    },
    {
      title: '音频',
      dataIndex: 'hasAudio',
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 400,
      fixed: 'right',
    },
  ]
}

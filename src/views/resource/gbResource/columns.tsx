import { ColumnsType } from 'ant-design-vue/lib/table/interface'

export function deviceColumns(): ColumnsType {
  return [
    {
      title: '设备编号',
      dataIndex: 'deviceId',
      fixed: 'left',
      width: 200,
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '生产厂商',
      dataIndex: 'manufacturer',
      width: 200,
    },
    {
      title: '信令传输',
      dataIndex: 'transport',
      width: 150,
    },
    {
      title: '流传输',
      dataIndex: 'streamMode',
      width: 150,
    },
    {
      title: '网络地址',
      dataIndex: 'hostAddress',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'onLine',
      width: 100,
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      width: 200,
    },
    {
      title: '通道',
      dataIndex: 'channelCount',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 300,
    },
  ]
}

export function deviceColumns() {
  return [
    {
      title: '设备编号',
      dataIndex: 'deviceId',
      fixed: 'left',
      width: 200,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '生产厂商',
      dataIndex: 'manufacturer',
    },
    {
      title: '信令传输',
      dataIndex: 'transport',
      width: 100,
    },
    {
      title: '流传输',
      dataIndex: 'streamMode',
      width: 100,
    },
    {
      title: '网络地址',
      dataIndex: 'hostAddress',
    },
    {
      title: '状态',
      dataIndex: 'online',
      width: 60,
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
    },
    {
      title: '通道数',
      dataIndex: 'channelCount',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 300,
    },
  ]
}

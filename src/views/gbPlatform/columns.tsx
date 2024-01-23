import { ColumnsType } from 'ant-design-vue/lib/table/interface'

export function platformColumns(): ColumnsType {
  return [
    {
      title: '名称',
      dataIndex: 'name',
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: '上级平台国标编号',
      dataIndex: 'serverGBId',
      fixed: 'left',
      width: 200,
    },
    {
      title: '本平台国标编号',
      dataIndex: 'deviceGBId',
      fixed: 'left',
      width: 200,
    },
    {
      title: '地址',
      dataIndex: 'hostAddress',
      width: 180,
    },
    {
      title: '订阅状态',
      dataIndex: 'subscribe',
      width: 100,
    },
    {
      title: '注册周期',
      dataIndex: 'expires',
    },
    {
      title: '心跳周期',
      dataIndex: 'keepTimeout',
      ellipsis: true,
    },
    {
      title: '协议',
      dataIndex: 'transport',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '启用',
      dataIndex: 'enable',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 250,
      fixed: 'right',
    },
  ]
}

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
    },
    {
      title: '本平台国标编号',
      dataIndex: 'deviceGBId',
      fixed: 'left',
    },
    {
      title: '地址',
      dataIndex: 'hostAddress',
    },
    {
      title: '注册周期',
      dataIndex: 'expires',
      width: 100,
    },
    {
      title: '心跳周期',
      dataIndex: 'keepTimeout',
      width: 200,
      ellipsis: true,
    },
    {
      title: '国标编码',
      dataIndex: 'gbId',
      width: 200,
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
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 250,
      fixed: 'right',
    },
  ]
}

import { ColumnsType } from 'ant-design-vue/lib/table/interface'

export function commonLogColumns(): ColumnsType {
  return [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '方法',
      dataIndex: 'type',
    },
    {
      title: 'URI',
      dataIndex: 'uri',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '结果',
      dataIndex: 'result',
    },
    {
      title: '耗时',
      dataIndex: 'timing',
    },
    {
      title: '用户',
      dataIndex: 'username',
    },
    {
      title: '时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
    },
  ]
}

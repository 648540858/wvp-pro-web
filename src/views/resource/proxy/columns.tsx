import { ColumnsType } from 'ant-design-vue/lib/table/interface'

export function proxyColumns(): ColumnsType {
  return [
    {
      title: '名称',
      dataIndex: 'name',
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: '应用名',
      dataIndex: 'app',
      fixed: 'left',
    },
    {
      title: '流ID',
      dataIndex: 'stream',
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
    },
    {
      title: '源地址',
      dataIndex: 'url',
      width: 200,
      ellipsis: true,
    },
    {
      title: '国标编码',
      dataIndex: 'gbId',
      width: 200,
    },
    {
      title: '音频',
      dataIndex: 'enableAudio',
    },
    {
      title: '拉流状态',
      dataIndex: 'pulling',
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

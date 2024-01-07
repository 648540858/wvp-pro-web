import { ColumnsType } from 'ant-design-vue/lib/table/interface'

export function proxyColumns(): ColumnsType {
  return [
    {
      title: '名称',
      dataIndex: 'name',
      fixed: 'left',
      width: 200,
    },
    {
      title: '应用名',
      dataIndex: 'app',
      fixed: 'left',
      width: 200,
    },
    {
      title: '流ID',
      dataIndex: 'stream',
      width: 200,
    },
    {
      title: '流地址',
      dataIndex: 'url',
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 200,
    },
    {
      title: '源地址',
      dataIndex: 'url',
      width: 200,
    },
    {
      title: '国标编码',
      dataIndex: 'gbId',
      width: 200,
    },
    {
      title: '启用',
      dataIndex: 'enable',
      width: 100,
    },
    {
      title: '音频',
      dataIndex: 'enableAudio',
      width: 150,
    },
    {
      title: '录制',
      dataIndex: 'enableMp4',
      width: 150,
    },
    {
      title: '无人观看',
      dataIndex: 'noneReader',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
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

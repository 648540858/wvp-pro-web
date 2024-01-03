import { ColumnsType } from 'ant-design-vue/lib/table/interface'

export function cloudRecordColumns(): ColumnsType {
  return [
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
      title: '生产厂商',
      dataIndex: 'manufacturer',
      width: 200,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      width: 150,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 150,
    },
    {
      title: '时长',
      dataIndex: 'timeLen',
      width: 200,
    },
    {
      title: '文件名',
      dataIndex: 'fileName',
      width: 100,
    },
    {
      title: '流媒体',
      dataIndex: 'mediaServerId',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 600,
      fixed: 'right',
    },
  ]
}

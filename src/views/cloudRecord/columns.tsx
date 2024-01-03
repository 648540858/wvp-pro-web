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
      title: '开始时间',
      dataIndex: 'startTime',
      width: 200,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 200,
    },
    {
      title: '时长',
      dataIndex: 'timeLen',
      width: 200,
    },
    {
      title: '文件名',
      dataIndex: 'fileName',
      width: 200,
    },
    {
      title: '流媒体',
      dataIndex: 'mediaServerId',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 200,
      fixed: 'right',
    },
  ]
}

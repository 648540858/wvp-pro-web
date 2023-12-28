import { ColumnsType } from 'ant-design-vue/lib/table/interface'

export function pushColumns(): ColumnsType {
  return [
    {
      title: '应用名',
      dataIndex: 'app',
      fixed: 'left',
      width: 200,
    },
    {
      title: '流id',
      dataIndex: 'stream',
      width: 200,
    },
    {
      title: '观看总人数',
      dataIndex: 'totalReaderCount',
      width: 200,
    },
    {
      title: '源类型',
      dataIndex: 'originTypeStr',
      width: 200,
    },
    {
      title: '存活时间',
      dataIndex: 'aliveSecond',
      width: 200,
    },
    {
      title: '流媒体',
      dataIndex: 'mediaServerId',
      width: 100,
    },
    {
      title: '推流时间',
      dataIndex: 'pushTime',
      width: 150,
    },
    {
      title: '正在推流',
      dataIndex: 'pushIng',
      width: 150,
    },
    {
      title: '本平台推流',
      dataIndex: 'self',
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

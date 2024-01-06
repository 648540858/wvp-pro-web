import { ColumnsType } from 'ant-design-vue/lib/table/interface'

export function pushColumns(): ColumnsType {
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
      title: '流id',
      dataIndex: 'stream',
      width: 200,
    },
    {
      title: '国标编号',
      dataIndex: 'gbId',
      width: 200,
    },
    {
      title: '位置',
      dataIndex: 'position',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
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
      width: 200,
    },
    {
      title: '正在推流',
      dataIndex: 'pushIng',
      width: 200,
    },
    {
      title: '平台直推',
      dataIndex: 'self',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 400,
      fixed: 'right',
    },
  ]
}

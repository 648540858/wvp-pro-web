import { ColumnsType } from 'ant-design-vue/lib/table/interface'

export function channelInGroupColumns(): ColumnsType {
  return [
    {
      title: '通道名称',
      dataIndex: 'commonGbName',
      fixed: 'left',
      width: 200,
    },
    {
      title: '通道编号',
      dataIndex: 'commonGbDeviceID',
      fixed: 'left',
      width: 200,
    },
    {
      title: '通道类型',
      dataIndex: 'type',
      fixed: 'left',
      width: 200,
    },
    {
      title: '在线状态',
      dataIndex: 'commonGbStatus',
      width: 200,
    },
    {
      title: '添加状态',
      dataIndex: 'statusInGroup',
      width: 200,
    },
  ]
}

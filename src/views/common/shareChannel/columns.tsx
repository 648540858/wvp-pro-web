import { ColumnsType } from 'ant-design-vue/lib/table/interface'

export function shareChannelColumns(): ColumnsType {
  return [
    {
      title: '编号',
      dataIndex: 'commonGbDeviceID',
      fixed: 'left',
      width: 200,
    },
    {
      title: '名称',
      dataIndex: 'commonGbName',
      width: 200,
    },
    {
      title: '厂商',
      dataIndex: 'commonGbManufacturer',
      width: 200,
    },
    {
      title: '地址',
      dataIndex: 'commonGbAddress',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'commonGbStatus',
      width: 100,
    },
    {
      title: '资源',
      dataIndex: 'type',
      width: 200,
    },
  ]
}

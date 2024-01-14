import { ColumnsType } from 'ant-design-vue/lib/table/interface'

export function commonChannelColumns(): ColumnsType {
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
      title: '地理位置',
      dataIndex: 'commonGbLongitudeAndLatitude',
      width: 150,
    },
    {
      title: '云台',
      dataIndex: 'commonGbPtzType',
      width: 150,
    },
    {
      title: '位置类型',
      dataIndex: 'commonGbPositionType',
      width: 150,
    },
    {
      title: '室内/外',
      dataIndex: 'commonGbRoomType',
      width: 150,
    },
    {
      title: '资源',
      dataIndex: 'type',
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

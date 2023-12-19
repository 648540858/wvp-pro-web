import { ColumnsType } from 'ant-design-vue/lib/table/interface'

export function commonChannelColumns(): ColumnsType {
  return [
    {
      title: '通道编号',
      dataIndex: 'commonGbDeviceID',
      fixed: 'left',
      width: 200,
    },
    {
      title: '通道名称',
      dataIndex: 'commonGbName',
      width: 200,
    },
    {
      title: '设备厂商',
      dataIndex: 'commonGbManufacturer',
      width: 200,
    },
    {
      title: '行政区域',
      dataIndex: 'commonGbCivilCode',
      width: 200,
    },
    {
      title: '安装地址',
      dataIndex: 'commonGbAddress',
      width: 200,
    },
    {
      title: '设备状态',
      dataIndex: 'commonGbStatus',
      width: 100,
    },
    {
      title: '地理位置',
      dataIndex: 'commonGbLongitudeAndLatitude',
      width: 150,
    },
    {
      title: '云台类型',
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
      title: '来源类型',
      dataIndex: 'type',
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

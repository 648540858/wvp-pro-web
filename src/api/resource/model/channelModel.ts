import { BasicFetchResult, BasicPageParams } from '/@/api/model/baseModel'
import { TableProps as RcTableProps } from 'ant-design-vue/lib/vc-table/Table'

export interface CommonGbChannel extends RcTableProps {
  // 数据库自增ID
  commonGbId: number
  // 设备/区域/系统编码(必选)
  commonGbDeviceID: string
  // 设备/区域/系统名称(必选)
  commonGbName: string
  // 当为设备时,设备厂商(必选)
  commonGbManufacturer?: string
  // 当为设备时,设备型号(必选)
  commonGbModel?: string
  // 当为设备时,设备归属(必选)
  commonGbOwner?: string
  // 行政区域(必选)
  commonGbCivilCode: string
  // 警区(可选)
  commonGbBlock?: string
  // 当为设备时,安装地址(必选)
  commonGbAddress?: string
  // 当为设备时,是否有子设备(必选)1有,0没有
  commonGbParental: number
  // 父设备/区域/系统ID(必选)
  commonGbParentID?: string
  // 信令安全模式(可选)缺省为0; 0:不采用;2:S/MIME 签名方式;3:S/MIME加密签名同时采用方式;4:数字摘要方式
  commonGbSafetyWay?: number
  // 注册方式(必选)缺省为1;1:符合IETFRFC3261标准的认证注册模式;2:基于口令的双向认证注册模式;3:基于数字证书的双向认证注册模式
  commonGbRegisterWay?: number
  // 证书序列号(有证书的设备必选)
  commonGbCertNum?: string
  // 证书有效标识(有证书的设备必选)缺省为0;证书有效标识:0:无效 1:有效
  commonGbCertifiable?: number
  // 无效原因码(有证书且证书无效的设备必选)
  commonGbErrCode?: number
  // 证书终止有效期(有证书的设备必选)
  commonGbEndTime?: string
  // 保密属性(必选)缺省为0;0:不涉密,1:涉密
  commonGbSecrecy?: number
  // 设备/区域/系统IP地址(可选)
  commonGbIPAddress?: string
  // 设备/区域/系统端口(可选)
  commonGbPort?: number
  // 设备口令(可选)
  commonGbPassword?: string
  // 设备状态(必选)
  commonGbStatus: boolean
  // 经度(可选)
  commonGbLongitude: number
  // 纬度(可选)
  commonGbLatitude: number
  // 摄像机类型扩展,标识摄像机类型, 当目录项为摄像机时可选: 1-球机; 2-半球; 3-固定枪机; 4-遥控枪机
  commonGbPtzType: number
  // 摄像机位置类型扩展。
  // 1-省际检查站、
  // 2-党政机关、
  // 3-车站码头、
  // 4-中心广场、
  // 5-体育场馆、
  // 6-商业中心、
  // 7-宗教场所、
  // 8-校园周边、
  // 9-治安复杂区域、
  // 10-交通干线
  commonGbPositionType: number
  // 安装位置室外、室内属性, 当目录项为摄像机时可选。 1-室外、2-室内
  commonGbRoomType: number
  // 用途, 当目录项为摄像机时可选。1-治安、 2-交通、 3-重点、
  commonGbUseType: number
  // 补光属性 1-无补光、2-红外补光、 3-白光补光
  commonGbSupplyLightType?: number
  // 摄像机监视方位属性。当目录项为摄像机时且为固定摄像机或设置看守位摄像机时可选。
  // 1-东、
  // 2-西、
  // 3-南、
  // 4-北、
  // 5-东南、
  // 6-东北、
  // 7-西南、
  // 8-西北
  commonGbDirectionType?: number
  // 摄像机支持的分辨率,可有多个分辨率值,各个取值间以“/”分隔。分辨率取值参见附录 F中SDPf字段规定。当目录项为摄像机时可选。
  commonGbResolution?: string
  // 虚拟组织所属的业务分组ID,业务分组根据特定的业务需求制定,一个业务分组包含一组特定的虚拟组织
  commonGbBusinessGroupID?: string
  // 下载倍速范围(可选),各可选参数以“/”分隔,如设备支持1,2,4倍速下载则应写为“1/2/4”
  commonGbDownloadSpeed?: string
  // 时域编码能力,取值0:不支持;1:1级增强;2:2级增强;3:3级增强(可选)
  commonGbSVCTimeSupportMode?: number
  // 空域编码能力,取值0:不支持;1:1级增强;2:2级增强;3:3级增强(可选)
  commonGbSVCSpaceSupportMode?: number
  // 类型: 28181, push, proxy
  type: string
  // 类型Id
  typeId: string
  // 更新时间
  updateTime?: string
  // 创建时间
  createTime?: string
}

export type ChannelListResultModel = BasicFetchResult<CommonGbChannel>

export interface ChannelListForGroupParams extends BasicPageParams {
  query?: string | null | undefined
  type?: string | null | undefined
  inGroup?: boolean | null | undefined
  inRegion?: boolean | null | undefined
  groupDeviceId?: string | null | undefined
  regionDeviceId?: string | null | undefined
  ptzType?: string | null | undefined
  online?: string | null | undefined
}

export interface UpdateCommonChannelToGroup extends RcTableProps {
  // 数据库自增ID
  commonGbIds: number[]
  commonGbBusinessGroupID: string
}

export interface UpdateCommonChannelToRegion extends RcTableProps {
  // 数据库自增ID
  commonGbIds: number[]
  commonGbCivilCode: string
}

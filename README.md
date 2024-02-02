# WVP-PRO 新的 WEB 前端

> 参考: vbenjs/vue-vben-admin thin 分支实现，地址在： https://github.com/vbenjs/vue-vben-admin/tree/main


## 概览
- 服务信息： 持续运行时间，通道总数，今日点播数量
- 资源统计， 环形图， 内容：总数，国标28181,拉流代理，推流列表  
- 负载统计,  柱状图， 每个媒体节点当前的负载数量  
- 快捷入口， 点击直达， 国标设备列表， 推流列表， 拉流代理列表



## 统计分析  
- 每个上级平台的当日点播个数 动态排序柱状图，
- 每个类型被带播放次数， 堆叠条形图 总数，成功数
- 资源点位分布，热力图，
- 过去24小时的每小时的点播次数 折线图堆叠 总数，成功数

## 运维监控
- CPU
- 内存
- 硬盘
- 带宽


部署在spring boot中时 VITE_GLOB_API_URL配置空字符串即可， 部署在nginx下时设置为具体的服务信息
时间轴组件来自： https://github.com/gitboyzcf/time-line?tab=readme-ov-file



<template>
  <div style="height: 100%; min-width: 280px; padding-top: 0.5rem" id="groupTree">
    <a-tree
      :show-icon="true"
      v-model:expanded-keys="expandedKeys"
      v-model:selectedKeys="selectedKeys"
      :tree-data="treeData"
      :load-data="onLoadData"
      :height="treeHeight"
      style="background-color: transparent"
    >
      <template #icon="{ key, ptzType, isLeaf }">
        <template v-if="key === ''">
          <Icon icon="tdesign:home" />
        </template>
        <template v-if="key !== '' && !isLeaf">
          <Icon icon="material-symbols:ad-group-outline" />
        </template>
        <template v-if="ptzType === 0">
          <Icon icon="icon-park-outline:camera-five" />
        </template>
        <template v-if="ptzType === 1">
          <Icon icon="icon-park-outline:camera-one" />
        </template>
        <template v-if="ptzType === 2">
          <Icon icon="icon-park-solid:camera-four" />
        </template>
        <template v-if="ptzType === 3">
          <Icon icon="icon-park-outline:surveillance-cameras-one" />
        </template>
        <template v-if="ptzType === 4">
          <Icon icon="icon-park-outline:surveillance-cameras-two" />
        </template>
      </template>
      <template #title="{ key, title, data }">
        <a-dropdown v-if="!data.isLeaf" :trigger="['contextmenu']">
          <span>{{ title }}</span>
          <template #overlay>
            <a-menu @click="({ key: menuKey }) => onContextMenuClick(key, menuKey, data.data)">
              <a-menu-item key="add"> 添加分组 </a-menu-item>
              <a-menu-item key="edit" v-if="data.data"> 编辑分组 </a-menu-item>
              <a-menu-item key="delete" v-if="data.data"> 删除分组 </a-menu-item>
              <a-menu-item key="clearChannel" v-if="data.data"> 清空通道 </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-dropdown v-if="data.isLeaf" :trigger="['contextmenu']">
          <span>{{ title }}</span>
          <template #overlay>
            <a-menu @click="({ key: menuKey }) => deleteChannel(key, menuKey, data.data)">
              <a-menu-item key="deleteChannel" v-if="data.isLeaf"> 移除 </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-tree>
    <EditGroup ref="editGroupRef" />
  </div>
</template>
<script lang="ts" setup>
  import {
    Dropdown as ADropdown,
    MenuItem as AMenuItem,
    Menu as AMenu,
    Tree as ATree,
    Modal,
    message,
  } from 'ant-design-vue'
  import type { TreeProps } from 'ant-design-vue'
  import { onMounted, ref } from 'vue'
  import { deleteGroupApi, queryChildGroupListApi } from '/@/api/resource/group'
  import { queryChannelList, removeFromGroup } from '/@/api/resource/channel'
  import { Icon } from '/@/components/Icon'
  import EditGroup from '../../editGroup/index.vue'
  import { Group } from '/@/api/resource/model/groupModel'
  import { CommonGbChannel } from '/@/api/resource/model/channelModel'
  import { DataNode } from 'ant-design-vue/lib/vc-tree/interface'

  const expandedKeys = ref<(string | number)[]>(['TopParentNote'])
  const selectedKeys = ref<string[]>([])
  const treeData = ref<TreeProps['treeData']>([
    { title: '本平台', key: 'TopParentNote', data: undefined, selectable: false },
  ])
  const treeHeight = ref<number>(300)
  const editGroupRef = ref()

  // 获取默认的节点数据
  queryChildGroupListApi({
    groupParentId: '',
    page: 1,
    count: 10000,
  }).then((result) => {
    console.log(result)
    if (result.total == 0) {
      return
    }
    treeData.value[0].children = []
    for (let i = 0; i < result.list.length; i++) {
      treeData.value[0].children.push({
        title: result.list[i].commonGroupName,
        key: result.list[i].commonGroupDeviceId,
        isLeaf: false,
        data: result.list[i],
      })
    }
  })
  const onLoadData: TreeProps['loadData'] = (treeNode: any) => {
    return new Promise<void>((resolve) => {
      if (treeNode.dataRef.children) {
        resolve()
        return
      }
      // TODO 后续实现分页查询，目前一次性全部获取
      queryChildGroupListApi({
        groupParentId: treeNode.key,
        page: 1,
        count: 10000,
      })
        .then((result) => {
          console.log(result)
          if (result.total == 0) {
            resolve()
            return
          }
          treeNode.dataRef.children = []
          for (let i = 0; i < result.list.length; i++) {
            treeNode.dataRef.children.push({
              title: result.list[i].commonGroupName,
              key: result.list[i].commonGroupDeviceId,
              isLeaf: false,
              data: result.list[i],
            })
          }
          treeData.value = [...treeData.value]
        })
        .then(() => {
          if (treeNode.key === '') {
            resolve()
            return
          }
          queryChannelList({
            groupDeviceId: treeNode.key,
            page: 1,
            count: 1000,
            query: '',
            inGroup: null,
            inRegion: null,
            regionDeviceId: null,
            type: null,
          }).then((result) => {
            console.log(result)
            if (result.total == 0) {
              resolve()
              return
            }
            treeNode.dataRef.children = []
            for (let i = 0; i < result.list.length; i++) {
              treeNode.dataRef.children.push({
                title: result.list[i].commonGbName,
                key: result.list[i].commonGbDeviceID,
                isLeaf: true,
                ptzType: result.list[i].commonGbPtzType,
                data: result.list[i],
                selectable: false,
              })
            }
            treeData.value = [...treeData.value]
          })
        })
        .catch((exception) => {
          console.error(exception)
        })
        .finally(() => {
          resolve()
        })
    })
  }
  const getSelectKey = () => {
    return selectedKeys.value[0]
  }

  const refreshNote = (key: string, data: CommonGbChannel[]) => {
    treeAction(treeData.value, key, (node: DataNode[], item: DataNode, index: number) => {
      if (!item.children) {
        item.children = []
      }
      for (let i = 0; i < data.length; i++) {
        item.children.push({
          title: data[i].commonGbName,
          key: data[i].commonGbDeviceID,
          isLeaf: true,
          ptzType: data[i].commonGbPtzType,
          data: data[i],
          selectable: false,
        })
      }
    })
  }
  const onContextMenuClick = (treeKey: string, menuKey: string | number, data: Group) => {
    if (menuKey === 'add') {
      // 为打开的编辑弹窗传输初始数据
      editGroupRef.value.openModel(
        {
          commonGroupId: -1,
          // 分组国标编号
          commonGroupDeviceId: '',
          // 分组名称
          commonGroupName: '',
          // 分组父ID
          commonGroupParentId: treeKey === '' ? '' : data.commonGroupDeviceId,
          // 分组的顶级节点ID，对应多个虚拟组织的业务分组ID
          commonGroupTopId: treeKey === '' ? '' : data.commonGroupTopId,
          // 创建时间
          commonGroupCreateTime: '',
          // 更新时间
          commonGroupUpdateTime: '',
        },
        (group: Group) => {
          treeAction(treeData.value, treeKey, (node: DataNode[], item: DataNode, index: number) => {
            if (!item.children) {
              item.children = []
            }
            item.children.push({
              title: group.commonGroupName,
              key: group.commonGroupDeviceId,
              data: group,
            })
          })
        },
      )
    } else if (menuKey === 'edit') {
      editGroupRef.value.openModel(data, (group: Group) => {
        treeAction(treeData.value, treeKey, (node: DataNode[], item: DataNode, index: number) => {
          item.key = group.commonGroupDeviceId
          item.title = group.commonGroupName
          item.data = group
        })
      })
    } else if (menuKey === 'delete') {
      Modal.confirm({
        title: `确认删除 ${data.commonGroupName}?`,
        // icon: '',
        content: `编号： ${data.commonGroupDeviceId} `,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          deleteGroupApi(data.commonGroupDeviceId)
            .then(() => {
              message.success('删除成功')
              treeAction(
                treeData.value,
                treeKey,
                (node: DataNode[], item: DataNode, index: number) => {
                  node.splice(index, 1)
                },
              )
            })
            .catch((exception) => {
              message.success('删除失败： ' + exception)
            })
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    } else if (menuKey === 'clearChannel') {
      Modal.confirm({
        title: `确认清空 ${data.commonGroupName}下的通道吗?`,
        // icon: '',
        content: `编号： ${data.commonGroupDeviceId} `,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          removeFromGroup({
            commonGbIds: [],
            commonGbBusinessGroupID: data.commonGroupDeviceId,
          })
            .then(() => {
              message.success('清空成功')
              treeAction(
                treeData.value,
                treeKey,
                (node: DataNode[], item: DataNode, index: number) => {
                  let children: DataNode[] = []
                  Object.assign(children, item.children)
                  item.children = []
                  children?.forEach((childNode: DataNode) => {
                    if (!childNode.isLeaf) {
                      item.children?.push(childNode)
                    }
                  })
                },
              )
              emits('deleteChannelEvent')
            })
            .catch((exception) => {
              message.success('删除失败： ' + exception)
            })
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    }
  }
  const emits = defineEmits(['deleteChannelEvent'])
  const deleteChannel = (treeKey: string, menuKey: string | number, data: CommonGbChannel) => {
    console.log(`treeKey: ${treeKey}, menuKey: ${menuKey}`)
    console.log(data)
    Modal.confirm({
      title: `确认删除 ${data.commonGbName}?`,
      // icon: '',
      content: `编号： ${data.commonGbDeviceID} `,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        removeFromGroup({
          commonGbIds: [data.commonGbId],
          commonGbBusinessGroupID: '',
        })
          .then(() => {
            message.success('删除成功')
            treeAction(treeData.value, treeKey, (node: DataNode[], id: string, index: number) => {
              node.splice(index, 1)
            })
            emits('deleteChannelEvent')
          })
          .catch((exception) => {
            message.success('删除失败： ' + exception)
          })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const treeAction = (node: DataNode[], id: string, fn: Function) => {
    console.log(node)
    node.some((item: DataNode, index: number) => {
      if (item.key === id) {
        fn(node, item, index)
        return true
      }
      if (item.children && item.children.length) {
        treeAction(item.children, id, fn)
      }
    })
  }
  onMounted(() => {
    const box = document.getElementById('resourceTree') as HTMLDivElement
    treeHeight.value = box.offsetHeight - 50
  })
  defineExpose({ getSelectKey, refreshNote })
</script>

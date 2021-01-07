<template>
  <el-row >
    <el-col>
    <el-cascader-panel id="cascader" :options="metaDataTree"
            ref="cascader"  v-model="selectedMetaData"
                       :props="{checkStrictly:true}"></el-cascader-panel>
    </el-col>
    <el-col>
    <el-input v-model="crudInput"></el-input>
    <el-button @click="add">新增</el-button>
    <el-button @click="del">删除</el-button>
    <el-button @click="edit">编辑</el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'ChangeMetaDataTree',
  data() {
    return {
      metaDataTree: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致',
          }, {
            value: 'fankui',
            label: '反馈',
          }, {
            value: 'xiaolv',
            label: '效率',
          }, {
            value: 'kekong',
            label: '可控',
          }],
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航',
          }, {
            value: 'dingbudaohang',
            label: '顶部导航',
          }],
        }],
      }, {
        value: 'zujian',
        label: '组件',
        children: [{
          value: 'basic',
          label: 'Basic',
          children: [{
            value: 'layout',
            label: 'Layout 布局',
          }, {
            value: 'color',
            label: 'Color 色彩',
          }, {
            value: 'typography',
            label: 'Typography 字体',
          }, {
            value: 'icon',
            label: 'Icon 图标',
          }, {
            value: 'button',
            label: 'Button 按钮',
          }],
        }, {
          value: 'form',
          label: 'Form',
          children: [{
            value: 'radio',
            label: 'Radio 单选框',
          }, {
            value: 'checkbox',
            label: 'Checkbox 多选框',
          }, {
            value: 'input',
            label: 'Input 输入框',
          }, {
            value: 'input-number',
            label: 'InputNumber 计数器',
          }, {
            value: 'select',
            label: 'Select 选择器',
          }, {
            value: 'cascader',
            label: 'Cascader 级联选择器',
          }, {
            value: 'switch',
            label: 'Switch 开关',
          }, {
            value: 'slider',
            label: 'Slider 滑块',
          }, {
            value: 'time-picker',
            label: 'TimePicker 时间选择器',
          }, {
            value: 'date-picker',
            label: 'DatePicker 日期选择器',
          }, {
            value: 'datetime-picker',
            label: 'DateTimePicker 日期时间选择器',
          }, {
            value: 'upload',
            label: 'Upload 上传',
          }, {
            value: 'rate',
            label: 'Rate 评分',
          }, {
            value: 'form',
            label: 'Form 表单',
          }],
        }, {
          value: 'data',
          label: 'Data',
          children: [{
            value: 'table',
            label: 'Table 表格',
          }, {
            value: 'tag',
            label: 'Tag 标签',
          }, {
            value: 'progress',
            label: 'Progress 进度条',
          }, {
            value: 'tree',
            label: 'Tree 树形控件',
          }, {
            value: 'pagination',
            label: 'Pagination 分页',
          }, {
            value: 'badge',
            label: 'Badge 标记',
          }],
        }, {
          value: 'notice',
          label: 'Notice',
          children: [{
            value: 'alert',
            label: 'Alert 警告',
          }, {
            value: 'loading',
            label: 'Loading 加载',
          }, {
            value: 'message',
            label: 'Message 消息提示',
          }, {
            value: 'message-box',
            label: 'MessageBox 弹框',
          }, {
            value: 'notification',
            label: 'Notification 通知',
          }],
        }, {
          value: 'navigation',
          label: 'Navigation',
          children: [{
            value: 'menu',
            label: 'NavMenu 导航菜单',
          }, {
            value: 'tabs',
            label: 'Tabs 标签页',
          }, {
            value: 'breadcrumb',
            label: 'Breadcrumb 面包屑',
          }, {
            value: 'dropdown',
            label: 'Dropdown 下拉菜单',
          }, {
            value: 'steps',
            label: 'Steps 步骤条',
          }],
        }, {
          value: 'others',
          label: 'Others',
          children: [{
            value: 'dialog',
            label: 'Dialog 对话框',
          }, {
            value: 'tooltip',
            label: 'Tooltip 文字提示',
          }, {
            value: 'popover',
            label: 'Popover 弹出框',
          }, {
            value: 'card',
            label: 'Card 卡片',
          }, {
            value: 'carousel',
            label: 'Carousel 走马灯',
          }, {
            value: 'collapse',
            label: 'Collapse 折叠面板',
          }],
        }],
      }, {
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'axure',
          label: 'Axure Components',
        }, {
          value: 'sketch',
          label: 'Sketch Templates',
        }, {
          value: 'jiaohu',
          label: '组件交互文档',
        }],
      }],
      crudInput: '',
      selectedMetaData: '',
    };
  },
  methods: {
    add() {
      console.log(this.selectedMetaData);
      const tempStr = JSON.stringify(this.metaDataTree);
      const changeMetaDataTree = JSON.parse(tempStr);
      let theNode = changeMetaDataTree;
      let searchNodes = changeMetaDataTree;
      for (let i = 0; i < this.selectedMetaData.length; i += 1) {
        for (let j = 0; j < searchNodes.length; j += 1) {
          if (searchNodes[j].value === this.selectedMetaData[i]) {
            if (i === this.selectedMetaData.length - 1) {
              theNode = searchNodes[j];
              break;
            }
            searchNodes = searchNodes[j].children;
            break;
          }
        }
      }

      if (theNode.children) {
        theNode.children.push({ label: this.crudInput, value: this.crudInput });
      } else {
        theNode.children = [];
        theNode.children.push({ label: this.crudInput, value: this.crudInput });
      }
      this.metaDataTree = changeMetaDataTree;
      console.log(this.metaDataTree);
    },
    del() {
      console.log(this.selectedMetaData);
      const tempStr = JSON.stringify(this.metaDataTree);
      const changeMetaDataTree = JSON.parse(tempStr);
      let theNode = changeMetaDataTree;
      let searchNodes = changeMetaDataTree;
      // 这里的theNode找到的其实是他的父亲结点，然后再把他删掉
      for (let i = 0; i < this.selectedMetaData.length - 1; i += 1) {
        for (let j = 0; j < searchNodes.length; j += 1) {
          if (searchNodes[j].value === this.selectedMetaData[i]) {
            if (i === this.selectedMetaData.length - 2) {
              theNode = searchNodes[j];
              break;
            }
            searchNodes = searchNodes[j].children;
            break;
          }
        }
      }
      console.log(theNode);
      console.log(theNode.children);
      try {
        theNode.children = theNode.children.filter((child) => child.value
          !== this.selectedMetaData[this.selectedMetaData.length - 1]);
        this.metaDataTree = changeMetaDataTree;
      } catch (e) {
        this.$messenger.warning('不允许删除根节点！');
      }
    },
    edit() {
      console.log(this.selectedMetaData);
      const tempStr = JSON.stringify(this.metaDataTree);
      const changeMetaDataTree = JSON.parse(tempStr);
      let theNode = changeMetaDataTree;
      let searchNodes = changeMetaDataTree;
      for (let i = 0; i < this.selectedMetaData.length; i += 1) {
        for (let j = 0; j < searchNodes.length; j += 1) {
          if (searchNodes[j].value === this.selectedMetaData[i]) {
            if (i === this.selectedMetaData.length - 1) {
              theNode = searchNodes[j];
              break;
            }
            searchNodes = searchNodes[j].children;
            break;
          }
        }
      }
      theNode.label = this.crudInput;
      theNode.value = this.crudInput;
      this.metaDataTree = changeMetaDataTree;
      console.log(this.metaDataTree);
    },
  },
};
</script>

<style scoped>

</style>

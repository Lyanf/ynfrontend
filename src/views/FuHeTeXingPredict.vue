<template>
  <el-tabs tab-position="left" label-width="50px">
    <el-tab-pane label="搜库法">
      <!--      日负荷特性指标计算-->
      <el-form inline label-position="top">
        <el-form-item label="年份：">
          <el-date-picker type="monthrange"
                          range-separator="至"
                          start-placeholder="开始年份"
                          end-placeholder="结束年份"
                          v-model="selectedDate"
                          format="yyyy"
          />
        </el-form-item>
        <el-form-item label="季节：">
          <el-select value=""/>
        </el-form-item>
        <el-form-item label="预测最大负荷：">
          <el-input placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="预测日电量：">
          <el-input placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="gamma：">
          <el-input placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="beta：">
          <el-input placeholder="请输入"/>
        </el-form-item>
        <el-form-item>
          <el-button>计算</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-table>
          <el-table-column label="日最大负荷"/>
          <el-table-column label="日平均负荷"/>
          <el-table-column label="日负荷率"/>
          <el-table-column label="日最小负荷率"/>
          <el-table-column label="日峰谷差"/>
          <el-table-column label="日峰谷差率"/>
        </el-table>
      </el-row>
      <ResultChart/>
    </el-tab-pane>

    <el-tab-pane label="双向夹逼法">
      <el-form inline label-position="top">
        <el-row>
          <el-form-item label="年份：">
            <el-date-picker type="monthrange"
                            range-separator="至"
                            start-placeholder="开始年份"
                            end-placeholder="结束年份"
                            v-model="selectedDate"
                            format="yyyy"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="季节：">
            <el-select value=""></el-select>
          </el-form-item>
          <el-form-item label="预测最大负荷：">
            <el-input placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="预测日电量：">
            <el-input placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button>计算</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-row>
        <el-table>
          <el-table-column label="日最大负荷"></el-table-column>
          <el-table-column label="日平均负荷"></el-table-column>
          <el-table-column label="日负荷率"></el-table-column>
          <el-table-column label="日最小负荷率"></el-table-column>
          <el-table-column label="日峰谷差"></el-table-column>
          <el-table-column label="日峰谷差率"></el-table-column>
        </el-table>
      </el-row>
    </el-tab-pane>

    <el-tab-pane label="分型插值法">
      <el-form inline label-position="top">
        <el-row>
          <el-form-item label="年份：">
            <el-date-picker type="monthrange"
                            range-separator="至"
                            start-placeholder="开始年份"
                            end-placeholder="结束年份"
                            v-model="selectedDate"
                            format="yyyy"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="季节：">
            <el-select value=""></el-select>
          </el-form-item>
          <el-form-item label="预测最大负荷：">
            <el-input placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="预测日电量：">
            <el-input placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button>计算</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <el-row>
        <el-table>
          <el-table-column label="日最大负荷"></el-table-column>
          <el-table-column label="日平均负荷"></el-table-column>
          <el-table-column label="日负荷率"></el-table-column>
          <el-table-column label="日最小负荷率"></el-table-column>
          <el-table-column label="日峰谷差"></el-table-column>
          <el-table-column label="日峰谷差率"></el-table-column>
        </el-table>
      </el-row>
    </el-tab-pane>

    <el-tab-pane label="年持续负荷曲线预测">
      <el-form inline label-position="top">
        <el-row>
          <el-form-item label="年份：">
            <el-date-picker type="monthrange"
                            range-separator="至"
                            start-placeholder="开始年份"
                            end-placeholder="结束年份"
                            v-model="selectedDate"
                            format="yyyy"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="预测最大负荷：">
            <el-input placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button>计算</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-tab-pane>
  </el-tabs>

</template>

<script>
import ResultChart from '@/components/ResultChart.vue';

export default {
  name: 'FuHeTeXingPredict',
  components: { ResultChart },
  data() {
    return {
      selectedDate: '',
      dialog1Visible: false,
      dialog2Visible: false,
      dialog3Visible: false,
      dialog4Visible: false,
      dialog5Visible: false,
    };
  },
  methods: {
    button1Clicked() {

    },
  },
};
</script>

<style scoped>
  .el-row {
    margin-bottom: 3em;
  }

  .el-form-item {
    margin-right: 5em;
    width: 30%;
  }
</style>

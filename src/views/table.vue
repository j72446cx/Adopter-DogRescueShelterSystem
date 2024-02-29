<template>
	<div>
    <el-row :gutter="20">
      <el-col :span="8" v-for="(data, index) in tableData" :key="index">
        <el-card shadow="hover" class="mgb20" style="height: 252px" v-if="data" @click="getFormDog(data.id)">
          <div class="user-info">
            <el-avatar :size="100" :src="data.imgURL" />
            <div class="user-info-cont">
              <div class="user-info-name">{{data.name}}</div>
              <div>ID: {{data.id}}</div>
            </div>
          </div>
          <div class="user-info-list">
            Intro: {{data.intro}}
          </div>
        </el-card>

      </el-col>
    </el-row>

    <div class="pagination">
      <el-pagination
          background
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="totalItems">
      </el-pagination>
    </div>

    <el-dialog v-model="this.dialogFormVisible">

      <el-form ref="form" :model="individualData" label-width="150px" v-if="step===0">

        <el-form-item label="ID: " class="label-bold">
          <span>{{individualData.id}}</span>
        </el-form-item>

        <el-form-item label="Name: " class="label-bold">
          <span>{{individualData.name}}</span>

        </el-form-item>

        <el-form-item label="Age: " class="label-bold">
          <span>{{individualData.age}}</span>
        </el-form-item>

        <el-form-item label="Species: " class="label-bold">
          <span>{{individualData.species}}</span>
        </el-form-item>

        <el-form-item label="Gender: " class="label-bold">
          <span>{{individualData.gender}}</span>
        </el-form-item>

        <el-form-item label="Status: " class="label-bold">
          <span>{{individualData.adoptStatus}}</span>
        </el-form-item>

        <el-form-item label="Medical History: " class="label-bold">
          <span>{{individualData.medicalHistory}}</span>
        </el-form-item>

        <el-form-item>

          <el-button type="info" @click="dialogFormVisible = false">OK</el-button>
          <el-button type="primary" @click="apply_dog(individualData.id)">Start Application</el-button>

        </el-form-item>


      </el-form>


      <el-form title="Application form" :model="application_form" label-width="280px" v-if="step===1">

        <el-form-item label="Why do you want to apply for the dog?">
          <el-input type="textarea" v-model="application_form.reason"></el-input>
        </el-form-item>
        <br><br>

        <el-form-item>
        <el-button type="info" @click="step--">Back</el-button>
        <el-button type="success">Submit</el-button>
        </el-form-item>

      </el-form>

    </el-dialog>
	</div>
</template>


<script>
import axios from 'axios'
import {ElMessage, ElMessageBox} from "element-plus";

export default{

  data(){
    return {
      tableData : [],
      individualData : [],
      currentPage : 1,
      pageSize : 6,
      totalCardsDisplay: 6,
      searchForm: {
        adoptStatus: "Available"
      },
      totalItems : 0,
      dialogFormVisible: false,
      step: 0,
      application_form: {
        reason: '',
        dog_id: '',
        adopter_id: localStorage.getItem("ms_id"),
        status: 'Pending'
      },
      temp_dog_id: ''
    }
  },
  methods: {

    getFormDog:function (id){
      this.getDetailDog(id)
      this.dialogFormVisible = true

    },

    getDetailDog: function (id){
      axios.get('/api/dogpage/'+id)
          .then((result) =>
          {this.individualData = result.data.data})
    },

    handleCurrentChange:function (val){
      this.currentPage=val
      this.fetchDogs()
    },

    transofmDateFormat: function (inputDate, showTime=0) {


      // Ensure inputDate is a valid date string
      const date = new Date(inputDate);

      // Get date and time components
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      // Format the date and time components
      const formattedDate = `${day}-${month}-${year}`;
      const formattedTime = `${hours}:${minutes}:${seconds}`;

      // Combine the formatted date and time
      if (showTime === 0){
        return `${formattedDate}`;
      }
      return `${formattedDate}  ${formattedTime}`;
    },

    fetchDogs:function (){
      const {adoptStatus} = this.searchForm
      const params={
        page: this.currentPage,
        pageSize:this.pageSize,
        adoptStatus
      };

      axios.get('/api/dogpage', {params:params})
          .then((result) => {
            this.tableData = result.data.data.rows;
            this.totalItems = result.data.data.total
            for (let i = 0; i < this.total; i++) {
              this.tableData[i].entryDate = this.transofmDateFormat(this.tableData[i].entryDate);
              this.tableData[i].lastVaccineDate = this.transofmDateFormat(this.tableData[i].lastVaccineDate);
              this.tableData[i].adoptedDate = this.transofmDateFormat(this.tableData[i].adoptedDate);
              this.tableData[i].lastUpdateTime = this.transofmDateFormat(this.tableData[i].lastUpdateTime, 1);
            }
          })
          .catch((error) => console.error('Error when fetching data: ', error))
    },

    apply_dog(dog_id){

      this.step = 1;
      this.temp_dog_id = dog_id;

    }
  },
  mounted() {
    // send async request to get data
    this.fetchDogs()


  }
}
</script>

<style scoped>
.handle-box {
	margin-bottom: 20px;
}

.handle-select {
	width: 120px;
}

.handle-input {
	width: 300px;
}
.table {
	width: 100%;
	font-size: 14px;
}
.red {
	color: #F56C6C;
}
.mr10 {
	margin-right: 10px;
}
.table-td-thumb {
	display: block;
	margin: auto;
	width: 40px;
	height: 40px;
}

.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.label-bold {
  font-weight: bold;
  color: #333;
}
</style>

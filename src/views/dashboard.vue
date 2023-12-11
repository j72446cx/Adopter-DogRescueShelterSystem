<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="8">


				<el-card shadow="hover" class="mgb20" style="height: 252px">
					<div class="user-info">
						<el-avatar :size="120" :src=imgurl />
						<div class="user-info-cont">
							<div class="user-info-name">{{ this.fullname }}</div>
							<div>{{ this.role }}</div>
						</div>
					</div>
				</el-card>



<!--				<el-card shadow="hover" style="height: 252px">-->
<!--					<template #header>-->
<!--						<div class="clearfix">-->
<!--							<span>Message Board</span>-->
<!--						</div>-->
<!--					</template>-->

<!--				</el-card>-->
			</el-col>




			<el-col :span="16">
				<el-row :gutter="20" class="mgb20">
<!--					<el-col :span="8">-->
<!--						<el-card shadow="hover" :body-style="{ padding: '0px' }">-->
<!--							<div class="grid-content grid-con-1">-->
<!--								<el-icon class="grid-con-icon"><User /></el-icon>-->
<!--								<div class="grid-cont-right">-->
<!--									<div class="grid-num"><span>{{this.resDogNumber}}</span></div>-->
<!--									<div>Your Dogs</div>-->
<!--								</div>-->
<!--							</div>-->
<!--						</el-card>-->
<!--					</el-col>-->
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-2">
								<el-icon class="grid-con-icon"><ChatDotRound /></el-icon>
								<div class="grid-cont-right">
									<div class="grid-num">{{all_message}}</div>
									<div>Messages</div>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-3">
								<el-icon class="grid-con-icon"><Notification /></el-icon>
								<div class="grid-cont-right">
									<div class="grid-num"><span>{{applicationInProgess}}</span></div>
									<div>Application in Progress</div>
								</div>
							</div>
						</el-card>
					</el-col>
				</el-row>




				<el-card shadow="hover" style="height: 403px" v-if="role === 'Potential Adopter'">
					<template #header>
						<div class="clearfix">
							<span>Application Status Tracking</span>
						</div>
					</template>

					<el-table :data="application" ref="multipleTable" style="width: 100%">
						<el-table-column prop="id" label="APPLICATION ID">
						</el-table-column>
            <el-table-column prop="dog_id" label="DOG ID">
            </el-table-column>
            <el-table-column prop="interview_date" label="INTERVIEW DATE">
            </el-table-column>
            <el-table-column prop="status" label="STATUS">
            </el-table-column>
					</el-table>
				</el-card>

        <el-card v-else shadow="hover" style="height: 403px">
          <template #header>
            <div class="clearfix">
              <span>Guide</span>
            </div>
          </template>

          <p>Hello {{firstName}}, welcome to our dog shelter application!</p>
          <br>
          <p>You can find any dogs available in our dog shelter by clicking

            <span @click="pushToTable" style="color: #409EFF; cursor: pointer; text-decoration: underline;">here</span>.</p>
          <br>
          <p>You can become a potential adopter, which is crucial step before your application, click

            <span @click="pushToForm" style="color: #409EFF; cursor: pointer; text-decoration: underline;">Potential Adopter Application</span> to start now! </p>

        </el-card>



			</el-col>
		</el-row>



	</div>
</template>
<script>

import axios from "axios";

import router from "../router/index.ts";
import messageStore from "../store/messageStore.ts";

export default {

  data(){
    return{
      imgurl : localStorage.getItem('ms_avatar'),
      name : localStorage.getItem('ms_username'),
      fullname: localStorage.getItem('full_name'),
      role : localStorage.getItem('ms_role'),
      gender: localStorage.getItem('ms_gender'),
      firstName: localStorage.getItem('ms_firstName'),
      all_message : messageStore.state.all_messages.length,

      currentPage: 1,
      pageSize: 5,
      applicationInProgess: 0,
      
      application : [],
    }
  },

  methods: {
    fetchApplication:function (){
      const params={
        page: this.currentPage,
        pageSize:this.pageSize,
        adopter_id : localStorage.getItem('ms_id')
      };

      axios.get('/api/adopter/application/adopter', {params:params})
          .then((result) => {
            this.application = result.data.data.rows;
            // console.log("this.application: ", JSON.stringify(this.application))
            // console.log("this.total", result.data.data.total)
            // console.log("this.application[0]: ", JSON.stringify(this.transofmDateFormat(this.application[0].created_date, 1)))
            this.applicationInProgess = this.application.length;
            for (let i = 0; i < result.data.data.total; i++) {
              this.application[i].interview_date = this.transofmDateFormat(this.application[i].interview_date, 1);
              this.application[i].created_date = this.transofmDateFormat(this.application[i].created_date, 1);
            };

          })
          .catch((error) => console.error('Error when fetching data: ', error))
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

      // Format the date and time components
      const formattedDate = `${day}-${month}-${year}`;
      const formattedTime = `${hours}:${minutes}`;

      // Combine the formatted date and time
      if (showTime === 0){
        return `${formattedDate}`;
      }
      return `${formattedDate}  ${formattedTime}`;
    },

    pushToTable:function (){
      router.push({name: 'table'})
    },
    pushToForm:function (){
      router.push({name: 'basecharts'})
    }

  },
  mounted() {
    this.fetchApplication();
  }

}
</script>

<style scoped>
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

.todo-item {
	font-size: 14px;
}

.todo-item-del {
	text-decoration: line-through;
	color: #999;
}

.schart {
	width: 100%;
	height: 300px;
}
</style>

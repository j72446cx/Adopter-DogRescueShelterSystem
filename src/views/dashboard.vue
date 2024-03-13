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




				<el-card shadow="hover" style="height: 403px" v-if="role === 'Potential Adopter'" v-loading="isloadingTable">
					<template #header>
						<div class="clearfix">
							<span>Application Tracking</span>
						</div>
					</template>

					<el-table :data="application" ref="multipleTable" style="width: 100%">
						<el-table-column prop="id" label="APPLICATION ID">
						</el-table-column>
            <el-table-column prop="dog_id" label="DOG ID" width="100">
            </el-table-column>

            <el-table-column label="INTERVIEW DATE" width="240">
              <template v-slot="scope">
<!--                <div v-if="scope.row.interview_date !== 'null'">-->
                  {{transofmDateFormat(scope.row.interview_date, 1, scope.row.status)}}
<!--                </div>-->

<!--                <el-button v-else type="text" @click="toggleInterview(scope.row.id)"> Click to make interview schedule-->

<!--                </el-button>-->
              </template>
            </el-table-column>

            <el-table-column prop="status" label="STATUS">
            </el-table-column>

            <el-table-column>
                <template v-slot="scope">
                  <el-button type="info" round v-if="scope.row.status === 'Rejected'" @click="reject_reason(scope.row.id)">See Reject Reason</el-button>
                  <el-button type="primary" round v-else-if="scope.row.interview_date === null && scope.row.status !== 'Pending' && scope.row.status !== 'Reviewing'" @click="toggleInterview(scope.row.id)">Make Schedule</el-button>
                  <el-button round v-else-if="scope.row.status !== 'Adopted'" @click="instruction_dialog_visible = true">What's next?</el-button>
                </template>
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

    <el-dialog title="Interview Schedule" v-model="dialog_interview">

      <span>Our working time: Weekday 9:00 - 17:00, Weekend 10:00 - 16:00</span>
      <br><br>

      <el-date-picker v-model="decided_interview_date"
                      type="datetime"
                      placeholder="Select date and time"
                      value-format="YYYY-MM-DD HH:mm"
                      :disabled-date="disabledDate"
      >
      </el-date-picker>

      <br><br>
      <el-button type="primary" round @click="interview_selection">Submit</el-button>
      <el-button type="info" round>Cancel</el-button>



    </el-dialog>

    <el-dialog title="Application Instructions" v-model="instruction_dialog_visible">
        <el-form label-width="500px">
          <div class="form-introduction">
            <p style="font-size: 20px; font-weight: bold; color: burlywood">1. Pending Status: </p>
            <p>Pending status means that we have not yet started processing your application for the stray dog. Rest assured, your application is in our queue, and we will begin the review process as soon as possible.</p>
            <br>

            <p style="font-size: 20px; font-weight: bold; color: darkorange ">2. Reviewing Status: </p>
            <p>When your application status is "Reviewing," it means that we are currently evaluating the personal details you provided in the potential adopter form. We carefully consider all the information to ensure the best fit between our dogs and their future homes.</p>
            <br>

            <p style="font-size: 20px; font-weight: bold; color: chocolate">3. Approved Status: </p>
            <p>Being "Approved" means that your personal information meets our standards. At this stage, we will inquire about your availability for an interview. You will propose a suitable interview date, and we will confirm if we are available during that time. If not, we will ask you to suggest another date. Should we need to propose a different date, we will notify you through our shelter's information system, where you can then make the necessary adjustments.</p>
            <br>

            <p style="font-size: 20px; font-weight: bold; color: #ff6cb0">4. Await Status: </p>
            <p>The "Await" status indicates that your interview date has been approved, and you are now waiting for the interview. You will need to visit our stray dog shelter on the scheduled date and interact with the dogs. This step is crucial for ensuring a good match between you and your potential new family member.</p>
            <br>

            <p style="font-size: 20px; font-weight: bold; color: #00a854">5. Adoption Pending Status: </p>
            <p>Adoption Pending means you have passed through our entire application process, and you are now approved to come to the shelter during our working hours to pick up the dog. Congratulations on reaching this final step towards bringing home a new furry friend!</p>
            <br>

            <p style="font-size: 20px; font-weight: bold; color: crimson">6. Rejected Status: </p>
            <p>A "Rejected" status can occur after the Reviewing or Await stages. This means that either your personal information or your interview results did not meet our criteria. We will inform you of the specific reasons for the rejection. It's important to pay close attention to the information sent via our shelter's system, as it will include critical details such as your interview scheduling and the reasons for any rejections.</p>
            <br>

            <p style="font-size: 20px; font-weight: bold; color: goldenrod">Notification: </p>
            <p >Please remember that our shelter's information system plays a vital role in keeping you informed about important details such as suitable interview dates and reasons for rejection, among others. We recommend checking it regularly to stay updated on your application status.</p>

          </div>

        </el-form>

    </el-dialog>

    <el-dialog title="Rejection Details" v-model="dialog_reject_reason_visible">
      <el-form>

        <el-form-item label="Reject reason: " class="label-bold">
          <span>{{rejectReason}}</span>
        </el-form-item>

        <el-form-item label="Notes on your basic information: " class="label-bold">
          <span></span>
          {{customer_notes}}
        </el-form-item>

        <el-form-item label="Notes on your family information: " class="label-bold">
          <span>{{family_notes}}</span>

        </el-form-item>

        <el-form-item label="Notes on your personal background: " class="label-bold">
          <span>{{personal_notes}}</span>

        </el-form-item>

        <el-form-item label="Notes on your residence information: " class="label-bold">
          <span>{{residence_notes}}</span>

        </el-form-item>

        <el-form-item label="Conclusion: " class="label-bold">
          <span>{{overall_notes}}</span>

        </el-form-item>
        <br>
        <el-form-item>
          <el-button type="primary" round @click="dialog_reject_reason_visible = false">OK</el-button>
          <el-button type="info" round @click="clipboard">Have problem? Click to send email now</el-button>

        </el-form-item>
      </el-form>
    </el-dialog>



	</div>
</template>
<script>

import service from "../utils/request.ts";

import router from "../router/index.ts";
import messageStore from "../store/messageStore.ts";
import moment from 'moment'

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

      dialog_interview: false,

      decided_interview_date: '',
      temp_id : '',

      innerDialogVisible: false,
      instruction_dialog_visible: false,

      rejectReason: '',
      dialog_reject_reason_visible: false,
      customer_notes: '',
      form_notes: '',
      family_notes: '',
      residence_notes: '',
      personal_notes: '',
      overall_notes: '',

      isloadingTable: false

    }
  },

  methods: {
    fetchApplication:function (){
      this.isloadingTable = true;
      const params={
        page: this.currentPage,
        pageSize:this.pageSize,
        adopter_id : localStorage.getItem('ms_id')
      };

      service.get('/api/adopter/application/adopter', {params:params})
          .then((result) => {
            this.application = result.data.data.rows;
            this.applicationInProgess = this.application.filter(a => a.status !== 'Rejected').filter(b => b.status !== 'Adopted').length;


          }).then(() => setTimeout(() => {
            this.isloadingTable = false;
      }, 1000))
          .catch((error) => console.error('Error when fetching data: ', error))
    },

    transofmDateFormat: function (inputDate, showTime=0, status="") {

      if (status === "Approved" && inputDate === null){
        return "Being Decided";
      }

      if (status === "Approved" && inputDate !== null){
        return "Waiting for agreement"
      }

      if (status === "Rejected"){
        return "N/A"
      }

      if (inputDate === null){
        return "To be confirmed";
      }


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
    },



    interview_selection(){
      if (!this.validateTime()){
        console.log("Inccorect date format");
        this.$message.error("Incorrect format of datetime")
        return;
      }

      const param = {
        id: this.temp_id,
        interview_date: moment(this.decided_interview_date).format('YYYY-MM-DDTHH:mm:ss')
      }
      console.log("id: ", this.temp_id + "interview_date: ", this.decided_interview_date);
      service.put("api/adopter/application/editForm", param).then((res) =>
          {
            if (res.data.msg === "success"){
              console.log("Interview date submit successfully");
              this.$message({
                message: "Interview date scheduled successfully",
                type: 'success'
              });
              this.dialog_interview = false;
              this.fetchApplication();
            }
          }
      )
    },

    toggleInterview(id){
      this.dialog_interview=true;
      this.temp_id = id;

    },

    disabledDate(time) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setDate(oneMonthFromNow.getDate() + 30);
      return time.getTime() < today.getTime() || time.getTime() > oneMonthFromNow.getTime();
    },

    validateTime() {
      const selectedDate = new Date(this.decided_interview_date);
      const hour = selectedDate.getHours();
      const dayOfWeek = selectedDate.getDay();

      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
      let isValidTime = false;

      if (isWeekday) {

        isValidTime = hour >= 9 && hour < 17;
      } else {

        isValidTime = hour >= 10 && hour < 16;
      }

      // if (!isValidTime) {
      //   this.$message.error('Please select a time within the working hours.');
      // }

      return isValidTime;
    },

    async reject_reason(id){
      const res =  await service.get("api/adopter/application/"+id);

      this.rejectReason = res.data.data.reject_reason;

      const result = await service.get("api/reviewing", {params: {application_id: id}});

      this.customer_notes = result.data.data[0].customer_info_notes;
      this.family_notes = result.data.data[0].family_member_notes;
      this.form_notes = result.data.data[0].form_info_notes;
      this.residence_notes = result.data.data[0].residence_info_notes;
      this.personal_notes = result.data.data[0].personal_background_notes;
      this.overall_notes = result.data.data[0].overall_notes;

      this.dialog_reject_reason_visible = true;



    },

    clipboard(){
      const email = "dog.shelter.system@manchester.ac.uk";
      navigator.clipboard.writeText(email).then(() => {
        this.$message({
          type:'success',
          message: 'Email address copied successfully'
        })
      }).catch((err) => {
        console.log("error when copying email");
        this.$message.error("Error when copying email")
      })
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

.label-bold {
  font-weight: bold;
  color: #333;
}

span {
  white-space: pre-wrap;
  word-break: keep-all;
}

.form-introduction {
  font-family: Arial, sans-serif; /* 你可以选择任何合适的字体 */
  color: #333; /* 文本颜色 */
  margin-bottom: 20px;} /* 下方留出一些空间 */

p {
  margin-bottom: 10px; /* 段落之间的空间 */
  line-height: 1.6; /* 行高，提高阅读舒适度 */
  text-align: justify; /* 两端对齐 */
  word-break: keep-all;
}

/*p:first-child {*/
/*  font-size: 28px; !* 首段字体大小 *!*/
/*  font-weight: bold; !* 加粗标题 *!*/
/*  color: #444; !* 可以调整为稍深的颜色 *!*/
/*}*/
</style>

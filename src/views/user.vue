<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="12">
				<el-card shadow="hover">
					<template #header>
						<div class="clearfix">
							<span>Password Changing</span>
						</div>
					</template>
					<el-form label-width="200px">
						<el-form-item label="Early password：">
							<el-input type="password" v-model="input_earlypsw"></el-input>
						</el-form-item>
						<el-form-item label="New password：" v-model="formPsw.password">
							<el-input type="password" v-model="formPsw.password"></el-input>
						</el-form-item>
            <br>
						<el-form-item>
							<el-button type="primary" @click="onSubmitPassword">Submit</el-button>
						</el-form-item>
					</el-form>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import axios from "axios";
import router from "../router/index.ts";

export default {
  data() {
    return {
      username: localStorage.getItem("ms_username"),
      imgurl : localStorage.getItem('ms_avatar'),
      firstname: localStorage.getItem('ms_firstName'),
      lastname: localStorage.getItem('ms_lastname'),
      job: localStorage.getItem('ms_job'),
      staff_id: localStorage.getItem('ms_id'),
      password: localStorage.getItem('ms_password'),

      input_earlypsw: '',

      formPsw: {
        password: '',
        id: localStorage.getItem('ms_id')
      }
    }
  },

  methods: {
    async onSubmitPassword() {

      if (this.input_earlypsw === this.password){
            try{
              const res =  await axios.put('api/customer/edit', this.formPsw)
                if (res.data.msg === "success"){
                  this.$message({
                    message: "Password Changed Successfully",
                    type: 'success'
                  });

                  router.push("/login")
                }

                else{
                  this.$message({
                    message: "Some error occured, please contact IT department",
                    type: 'error'
                  })

                }
            }catch (err) {
                console.log("error when fetching data: ", err)
            }

      }
      else{
        this.$message({

          message: 'Your early password is incorrect',
          type: 'error'
        })
      }
    }
  }
}

</script>

<style scoped>
.info {
	text-align: center;
	padding: 35px 0;
}
.info-image {
	position: relative;
	margin: auto;
	width: 100px;
	height: 100px;
	background: #f8f8f8;
	border: 1px solid #eee;
	border-radius: 50px;
	overflow: hidden;
}

.info-edit {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	opacity: 0;
	transition: opacity 0.3s ease;
}
.info-edit i {
	color: #eee;
	font-size: 25px;
}
.info-image:hover .info-edit {
	opacity: 1;
}
.info-name {
	margin: 15px 0 10px;
	font-size: 24px;
	font-weight: 500;
	color: #262626;
}
.crop-demo-btn {
	position: relative;
}
.crop-input {
	position: absolute;
	width: 100px;
	height: 40px;
	left: 0;
	top: 0;
	opacity: 0;
	cursor: pointer;
}
</style>

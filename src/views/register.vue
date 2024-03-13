<template>
  <div class="container">
    <span class="title">Register</span>
    <div class="form-box">
      <el-form ref="form" :model="infoForm" :rules="rules" label-width="120px" label-position="right" class="register-form" @submit.native.prevent="onSubmitAdd">

            <el-form-item label="Firstname: " prop="firstName">
              <el-input v-model="infoForm.firstName"></el-input>
            </el-form-item>



              <el-form-item label="Lastname: " prop="lastName">
                <el-input v-model="infoForm.lastName"></el-input>
              </el-form-item>



              <el-form-item label="Other name ">
                <el-input v-model="infoForm.middleName"></el-input>
              </el-form-item>






            <el-form-item label="Age: " prop="age">
              <el-input v-model.number="infoForm.age"></el-input>
            </el-form-item>



            <el-form-item label="Gender: " prop="gender" style="width: 100%">

              <el-radio-group v-model="infoForm.gender">
                <el-radio label=Male>Male</el-radio>
                <el-radio label=Female>Female</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="Address: ">
              <el-input v-model="infoForm.address"></el-input>
            </el-form-item>


            <el-form-item label="Postcode: ">
            <el-input v-model="infoForm.postCode"></el-input>
          </el-form-item>




            <el-form-item label="Email: " prop="email">
              <el-input v-model="infoForm.email"></el-input>
            </el-form-item>



            <el-form-item label="Tel: " prop="phoneNumber">
              <el-input v-model="infoForm.phoneNumber"></el-input>
            </el-form-item>





              <el-form-item label="Username: " prop="username">
                <el-input v-model="infoForm.username"></el-input>
              </el-form-item>




              <el-form-item label="Password: " prop="password">
                <el-input v-model="infoForm.password"></el-input>
              </el-form-item>



            <el-form-item label="Avatar: " style="width: 100%" prop="avatar">
              <el-upload
                  drag
                  action="/api/upload"
                  name="image"
                  :file-list="fileList"
                  :limit="1"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :on-exceed="handleExceed"
                  :on-success="handleSuccess"
              >
                <el-button v-if="fileList.length === 0" size="small" type="primary">Click/Drag to upload your photo</el-button>
                <div v-if="fileList.length === 0" slot="tip" class="el-upload__tip">Only one photo can be uploaded</div>

                <div v-if="fileList.length !== 0" slot="tip" class="el-upload__tip">
                  <el-icon color="green"><Select /></el-icon> <span style="color: #00a854">Uploaded Successfully</span>
                  <br>
                  If you want to upload another photo, please delete the previous one at first!
                </div>

              </el-upload>

            </el-form-item>

            <el-form-item>
              <el-button :plain="true" @click="onSubmitAdd">Submit</el-button>
            </el-form-item>




      </el-form>

    </div>
  </div>
</template>

<script>
import service from "../utils/request.ts";
import router from "../router/index.ts";

export default {

  data(){
    return {
      infoForm : {
        age: '',
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        gender: '',
        address: '',
        postCode: '',
        avatar: '',
        username: '',
        password: '',
        phoneNumber:''


      },

      fileList: [],


      rules: {
        username: [
          { required: true, message: "Please input the username", trigger: "blur" },
          { min: 5, max: 15, message: "Username must be between 5 and 10 characters", trigger: "blur" }
        ],
        password: [
          { required: true, message: "Please input the password", trigger: "blur" },
          { min: 8, max: 15, message: "Password must be between 8 and 15 characters", trigger: "blur" },
          { pattern: /^(?=.*[A-Z])(?=.*[!@#$&*]).*$/, message: "Password must contain at least one uppercase letter and one special character", trigger: "blur" }
        ],
        firstName: [
          { required: true, message: "Please input the firstname", trigger: "blur" }
        ],
        lastName: [
          { required: true, message: "Please input the lastname", trigger: "blur" }
        ],
        age: [
          { required: true, message: "Please input the age", trigger: "blur" },
          { type: 'number', message: "Age must be a number", trigger: "blur" }
        ],
        gender: [
          { required: true, message: "Please select the gender", trigger: "change" }
        ],
        email: [
          { required: true, message: "Please input the email", trigger: "blur" },
          { type: "email", message: "Incorrect email format", trigger: ["blur", "change"] }
        ],
        phoneNumber: [
          { required: true, message: "Tel cannot be empty", trigger: "blur" },
          { pattern: /^(\+\d{1,3}[- ]?)?\d{10}$/, message: "Example format: +440123456789 for UK user", trigger: "blur" }
        ]
      }
    }
  },
  methods: {
    onSubmitAdd: function (){

      this.$refs.form.validate((valid) => {
        if(valid){
          service.post('/api/customer/save', this.infoForm)
              .then(() => console.log("Saving customer"))
              .then(() => this.$message({
                message: 'Register successfully',
                type: 'success'
              }))
              .then(() => router.push("/login"))
              .catch((error) => alert("Cannot register, please contact us by email"))
        }
        else{
          console.log("error submit")
          return false
        }
      })

    },

    handleExceed(file, fileList){
      this.$message.warning("Please first delete the photo you uploaded previously!")
    },

    handlePreview(file) {
      console.log(file);
    },

    handleSuccess: function (response, file){
      this.infoForm.avatar= response.data;
      this.fileList.push(file);
    },

    handleRemove(file) {

      this.infoForm.avatar = ''
      this.fileList=[]
    },

  }

}

</script>

<style scoped>
.container {
  max-width: 850px;
  margin: 0 auto;
  padding: 20px;
}
.title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}
.form-box {
  background: #f7f7f7;
  padding: 100px;
  border-radius: 50px;
  overflow-y: auto;
  max-height: 40vh;
}
.register-form {
  margin-top: 20px;
}
</style>

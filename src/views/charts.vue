<template>
	<div class="container">
    <div>
      <el-form ref="form" :model="infoForm" label-width="500px">

        <div v-if="currentStep === 0">
          <div class="form-introduction">
            <p>Welcome to Potential Adopter Application</p>
            <p>Thank you for considering the adoption of a rescue dog. This application form is a crucial step in ensuring that every dog we care for finds a loving and suitable home.</p>
            <br>
            <p style="font-size: 120%">Purpose of This Form:</p>
            <p>The information you provide here will help us match you with a dog that fits well with your lifestyle and preferences.</p>
            <p>It will also allow us to understand your living environment and how a dog would be accommodated in your home.</p>
            <br>

            <p style="font-size: 120%">Privacy and Confidentiality:</p>
            <p>We take your privacy seriously. All personal information collected in this form will be handled with the utmost confidentiality.</p>
            <p>Your data will be used solely for the purpose of the adoption process and will not be shared with any third parties without your explicit consent.</p>

            <br>
            <p style="font-size: 120%">Completing the Form:</p>
            <p>Please take your time to answer the questions as accurately and thoroughly as possible.</p>
            <p>This form will be evaluated by our staff when you deciding to adopt any dog in our shelter.</p>
            <p>Please note that any dishonest information or information that is not filled in carefully will make you less competitive with other potential adopters when adopting a dog in the future.</p>

            <br>
            <el-button type="primary" @click="addCurrentStep">I have read the above information and start the form</el-button>


          </div>
        </div>

        <div v-if="currentStep === 1">

          <span>Family Members</span>
          <el-form-item label="How many members in your house/apartment? " style="width: 100%">
            <el-input v-model="infoForm.householdMembers" style="width: 5%"></el-input>
          </el-form-item>

          <el-form-item label="Do you have children in your house/apartment? " style="width: 100%">

            <el-radio-group v-model="infoForm.children">
              <el-radio label=true>Yes</el-radio>
              <el-radio label=false>No</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="Do you have any other pets in your house/apartment? " style="width: 100%">
            <el-radio-group v-model="infoForm.otherPets">
              <el-radio label=true>Yes</el-radio>
              <el-radio label=false>No</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="Please upload one family photo: " style="width: 100%">
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

        </div>

        <div v-if="currentStep === 2">
          <span>Residence Information</span>

          <el-form-item label="What is the type of your residence?" style="width: 100%">
            <el-select v-model="infoForm.housingType" placeholder="">
              <el-option v-for="items in optionResidence" :key="items.value" :label="items.label" :value="items.value">
              </el-option>
            </el-select>
          </el-form-item>


          <el-form-item label="Do you own this property?" style="width: 100%">
            <el-radio-group v-model="infoForm.housingStability">
              <el-radio label="Owner">Yes</el-radio>
              <el-radio label="Temporal">No</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="infoForm.housingStability === 'Temporal'" label="Does your landlord allow you to have a dog?" style="width: 100%">
            <el-radio-group v-model="infoForm.landlordConsent">
              <el-radio label=true>Yes</el-radio>
              <el-radio label=false>No</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="infoForm.housingStability === 'Temporal'" label="Your landlord's email: " style="width: 65%">
            <el-input v-model="infoForm.landlordContact"></el-input>
          </el-form-item>

          <el-form-item label="Please upload one living room photo: " style="width: 100%">
            <el-upload
                drag
                action="/api/upload"
                name="image"
                :file-list="fileListLiving"
                :limit="1"
                :on-preview="handlePreview"
                :on-remove="handleRemoveLiving"
                :on-exceed="handleExceed"
                :on-success="handleSuccessLiving"
            >
              <el-button v-if="fileListLiving.length === 0" size="small" type="primary">Click/Drag to upload your photo</el-button>
              <div v-if="fileListLiving.length === 0" slot="tip" class="el-upload__tip">Only one photo can be uploaded</div>

              <div v-if="fileListLiving.length !== 0" slot="tip" class="el-upload__tip">
                <el-icon color="green"><Select /></el-icon> <span style="color: #00a854">Uploaded Successfully</span>
                <br>
                If you want to upload another photo, please delete the previous one at first!
              </div>

            </el-upload>

          </el-form-item>

          <el-form-item label="Please upload one kitchen photo: " style="width: 100%">
            <el-upload
                drag
                action="/api/upload"
                name="image"
                :file-list="fileListKitchen"
                :limit="1"
                :on-preview="handlePreview"
                :on-remove="handleRemoveKitchen"
                :on-exceed="handleExceed"
                :on-success="handleSuccessKitchen"
            >
              <el-button v-if="fileListKitchen.length === 0" size="small" type="primary">Click/Drag to upload your photo</el-button>
              <div v-if="fileListKitchen.length === 0" slot="tip" class="el-upload__tip">Only one photo can be uploaded</div>

              <div v-if="fileListKitchen.length !== 0" slot="tip" class="el-upload__tip">
                <el-icon color="green"><Select /></el-icon> <span style="color: #00a854">Uploaded Successfully</span>
                <br>
                If you want to upload another photo, please delete the previous one at first!
              </div>

            </el-upload>

          </el-form-item>


          <el-form-item label="Please upload one balcony photo: " style="width: 100%">
            <el-upload
                drag
                action="/api/upload"
                name="image"
                :file-list="fileListBalcony"
                :limit="1"
                :on-preview="handlePreview"
                :on-remove="handleRemoveBalcony"
                :on-exceed="handleExceed"
                :on-success="handleSuccessBalcony"
            >
              <el-button v-if="fileListBalcony.length === 0" size="small" type="primary">Click/Drag to upload your photo</el-button>
              <div v-if="fileListBalcony.length === 0" slot="tip" class="el-upload__tip">Only one photo can be uploaded</div>

              <div v-if="fileListBalcony.length !== 0" slot="tip" class="el-upload__tip">
                <el-icon color="green"><Select /></el-icon> <span style="color: #00a854">Uploaded Successfully</span>
                <br>
                If you want to upload another photo, please delete the previous one at first!
              </div>

            </el-upload>

          </el-form-item>

          <el-form-item label="Please upload one garden photo: " style="width: 100%">
            <el-upload
                drag
                action="/api/upload"
                name="image"
                :file-list="fileListGarden"
                :limit="1"
                :on-preview="handlePreview"
                :on-remove="handleRemoveGarden"
                :on-exceed="handleExceed"
                :on-success="handleSuccessGarden"
            >
              <el-button v-if="fileListGarden.length === 0" size="small" type="primary">Click/Drag to upload your photo</el-button>
              <div v-if="fileListGarden.length === 0" slot="tip" class="el-upload__tip">Only one photo can be uploaded</div>

              <div v-if="fileListGarden.length !== 0" slot="tip" class="el-upload__tip">
                <el-icon color="green"><Select /></el-icon> <span style="color: #00a854">Uploaded Successfully</span>
                <br>
                If you want to upload another photo, please delete the previous one at first!
              </div>

            </el-upload>

          </el-form-item>
        </div>

        <div v-if="currentStep === 3">
          <span>Personal Background</span>
          <el-form-item label="Please select your income level: " style="width: 100%">
            <el-select v-model="infoForm.incomeLevel" placeholder="">
              <el-option v-for="items in optionsIncomeLevel" :key="items.value" :label="items.label" :value="items.value">

              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="What is your daily schedule?" style="width: 100%">
            <el-input type="textarea" v-model="infoForm.workStudySchedule">
            </el-input>
          </el-form-item>

          <el-form-item label="Do you plan to buy insurance for your dog?"  style="width: 100%">
            <el-radio-group v-model="infoForm.petInsurance">
              <el-radio label=true>Yes</el-radio>
              <el-radio label=false>No</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="Do you have any dogs before?"  style="width: 100%">
            <el-radio-group v-model="infoForm.previousPetOwnership">
              <el-radio label=true>Yes</el-radio>
              <el-radio label=false>No</el-radio>
            </el-radio-group>
          </el-form-item>

        </div>

        <div v-if="currentStep === 4">
          <span>Dog Care Planning and Willingness</span>
          <el-form-item label="Do you have any dog care knowledge?" style="width: 100%">
            <el-radio-group v-model="petCare">
              <el-radio label="yes">Yes</el-radio>
              <el-radio label="no">No</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="petCare === 'yes'" label="Share to us anything you know:" style="width: 100%">
            <el-input type="textarea" v-model="infoForm.petCareKnowledge"></el-input>
          </el-form-item>

          <el-form-item label="What are your planned daily activities with the dog after adoption?" style="width: 100%">
            <el-input type="textarea" v-model="infoForm.dailyActivities"></el-input>
          </el-form-item>

          <el-form-item label="Why would you like to adopt a dog?" style="width: 100%">
            <el-input type="textarea" v-model="infoForm.adoptionPurpose"></el-input>
          </el-form-item>

          <el-form-item label="What species do you like the best?" style="width: 100%">
            <el-input v-model="infoForm.petPreference"></el-input>
          </el-form-item>

          <el-form-item label="What preparation did you do for your new family member?" style="width: 100%">
            <el-input type="textarea" v-model="infoForm.preparation"></el-input>
          </el-form-item>

          <el-form-item label="What is your emergency plan" style="width: 100%">
            <el-input type="textarea" v-model="infoForm.emergencyPlan"></el-input>
          </el-form-item>
        </div>

        <div v-if="currentStep === 5">
          <span>Reference and Commitment</span>
          <el-form-item label="Do you have any reference person?" style="width: 100%">
            <el-radio-group v-model="referencePerson">
              <el-radio label="yes">Yes</el-radio>
              <el-radio label="no">No</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="referencePerson === 'yes'" style="width: 65%" label="Please tell us his/her email">
            <el-input v-model="infoForm.referencePerson"></el-input>
          </el-form-item>

          <el-form-item label="Do you agree on our Adoption Regulations?">
            <el-radio-group v-model="infoForm.agreementCompliance">
              <el-radio label=true>Yes</el-radio>
              <el-radio label=false>No</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="Do you agree on our Post-Adoption Support Commitment?">
            <el-radio-group v-model="infoForm.postAdoptionSupportCommitment">
              <el-radio label=true>Yes</el-radio>
              <el-radio label=false>No</el-radio>
            </el-radio-group>
          </el-form-item>


        </div>
        <br><br>
        <el-form-item>
          <el-button v-if="currentStep <= 5 && currentStep !== 0" style="margin-top: 12px;" @click="backCurrentStep" type="info" round>Back</el-button>
          <el-button v-if="currentStep <= 4 && currentStep !== 0" style="margin-top: 12px;" @click="addCurrentStep" type="primary" round>Next</el-button>
          <el-button v-if="currentStep === 5" style="margin-top: 12px;" @click="onFinish" type="success" round>Submit</el-button>
        </el-form-item>

        <br>
        <el-form-item>
          <div class="steps-container">
            <el-steps :active="currentStep" finish-status="success">
              <el-step title="Start"></el-step>
              <el-step title="Family"></el-step>
              <el-step title="Residence"></el-step>
              <el-step title="Background"></el-step>
              <el-step title="Planning"></el-step>
              <el-step title="Commitment"></el-step>
            </el-steps>
          </div>

        </el-form-item>


      </el-form>
    </div>
	</div>
</template>

<script>

import axios from "axios";
import router from "../router/index.ts";

export default {
  data(){
    return{
      infoForm : {
        id: localStorage.getItem('ms_id'),
        householdMembers:'',
        children:'',
        otherPets:'',
        housingType: '',
        housingStability:'',
        landlordConsent:'',
        workStudySchedule: '',
        dailyActivities: '',
        incomeLevel: '',
        petInsurance: '',
        previousPetOwnership: '',
        petCareKnowledge: '',
        petPreference: '',
        adoptionPurpose: '',
        emergencyPlan: '',
        referencePerson: '',
        agreementCompliance: '',
        postAdoptionSupportCommitment: '',
        landlordContact: '',
        living_room: '',
        garden: '',
        balcony: '',
        kitchen: '',
        family_photo: '',
        preparation: ''
      },
      hideUpload: false,
      dialogVisible: false,
      currentStep: 0,
      propertyOwnerShip: '',
      petCare: '',
      referencePerson: '',



      fileList: [],
      fileListLiving: [],
      fileListKitchen: [],
      fileListBalcony: [],
      fileListGarden: [],



      optionsIncomeLevel: [
          {
        value: 'Lower than $25000',
        label: 'Lower than $25,000'
          },
        {
          value: '$25000 to $50000',
          label: '$25,000 to $50,000'
        },
        {
          value: '$50000 to $75000',
          label: '$50,000 to $75,000'
        },
        {
          value: '$75000 to $100000',
          label: '$75,000 to $100,000'
        },
        {
          value: 'Higher than $100000',
          label: 'Higher than $100,000'
        }

      ],
      optionResidence: [
        {
          value: 'Apartment',
          label: 'Apartment'
        },
        {
          value: 'House',
          label: 'House'
        }
      ]

    }
  },

  methods:{

    handleSuccess: function (response, file){
      this.infoForm.family_photo = response.data;
      this.fileList.push(file);
    },

    handleRemove(file) {

      this.infoForm.family_photo = ''
      this.fileList=[]
    },

    handleSuccessLiving: function (response, file){
      this.infoForm.living_room = response.data;
      this.fileListLiving.push(file);
    },

    handleRemoveLiving(file) {

      this.infoForm.living_room = ''
      this.fileListLiving=[]
    },

    handleSuccessBalcony: function (response, file){
      this.infoForm.balcony = response.data;
      this.fileListBalcony.push(file);
    },

    handleRemoveBalcony(file) {

      this.infoForm.balcony = ''
      this.fileListBalcony=[]
    },

    handleSuccessKitchen: function (response, file){
      this.infoForm.kitchen = response.data;
      this.fileListKitchen.push(file);
    },

    handleRemoveKitchen(file) {

      this.infoForm.kitchen = ''
      this.fileListKitchen=[]
    },

    handleSuccessGarden: function (response, file){
      this.infoForm.garden = response.data;
      this.fileListGarden.push(file);
    },

    handleRemoveGarden(file) {

      this.infoForm.garden = ''
      this.fileListGarden=[]
    },

    handleExceed(file, fileList){
      this.$message.warning("Please first delete the photo you uploaded previously!")
    },

    handlePreview(file) {
      console.log(file);
    },

    addCurrentStep: function (){
      this.currentStep ++
    },

    backCurrentStep: function (){
      this.currentStep --
    },

    onFinish: function (){
      console.log(JSON.stringify(this.infoForm));
      axios.post('api/adopter/save', this.infoForm).then((res) =>
          {
            if (res.data.msg === 'success'){
              this.$message(
                  {
                    message : "Form submit successfully",
                    type: 'success'

                  }

              )
            }

            if (res.data.msg === 'Potential Adopter already exists'){
              this.$message.error("You are already a potential adopter. If you want to modify it, please go to the User Center.")

            }
          }
      )
          .catch(() =>{
        this.$message.error("Error when submitting form, please contact us and report this error!")
      })

    }
  }
}

</script>

<style scoped>
.schart-box {
	display: inline-block;
	margin: 20px;
}
.schart {
	width: 600px;
	height: 400px;
}
.content-title {
	clear: both;
	font-weight: 400;
	line-height: 50px;
	margin: 10px 0;
	font-size: 22px;
	color: #1f2f3d;
}

.fixed-footer {
  position: fixed;
  left: 40%;
  bottom: 0;
  width: 50%;
  text-align: center;
  padding: 20px 0;
}

.content {
  margin-bottom: 60px; /* 调整这个值以确保内容和底部容器之间有足够的间距 */
}

.form-introduction {
  font-family: Arial, sans-serif; /* 你可以选择任何合适的字体 */
  color: #333; /* 文本颜色 */
  margin-bottom: 20px;} /* 下方留出一些空间 */

p {
  margin-bottom: 10px; /* 段落之间的空间 */
  line-height: 1.6; /* 行高，提高阅读舒适度 */
  text-align: justify; /* 两端对齐 */
}

p:first-child {
  font-size: 28px; /* 首段字体大小 */
  font-weight: bold; /* 加粗标题 */
  color: #444; /* 可以调整为稍深的颜色 */
}

.steps-container {
  position: relative; /* 固定位置 */
  left: 20%; /* 水平居中 */
  bottom: 0; /* 置于底部 */
  transform: translateX(-50%); /* 确保完全居中 */
  width: 100%; /* 容器宽度自适应 */
  padding: 10px; /* 可选：内部间距 */
}

.uploaded-image {
  max-width: 100%; /* 限制图片的最大宽度 */
  max-height: 200px; /* 限制图片的最大高度 */
  /* 其他样式，如边距、边框等 */
}


</style>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
<style rel="stylesheet/scss" lang="scss">
.disabled .el-upload--picture-card{
  display: none;
}
</style>

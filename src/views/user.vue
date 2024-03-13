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

      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>Information Modification</span>
              <el-tooltip content="Your modifications will not be applied in current applications that in progress!">
                <el-icon slot="reference"><WarningFilled /></el-icon>
              </el-tooltip>


            </div>
          </template>
          <el-form label-width="200px">

            <el-form-item>
              <el-link style="color: #00a854" @click="personal_info_drawer = true">Personal Information</el-link>
            </el-form-item>

            <el-form-item>
              <el-link style="color: #00a854" @click="family_info_drawer = true">Family Member Information</el-link>
            </el-form-item>

            <el-form-item>
              <el-link style="color: #00a854" @click="residence_info_drawer=true">Residence Information</el-link>
            </el-form-item>

            <el-form-item>
              <el-link style="color: #00a854" @click="dog_care_drawer=true">Dog Care and Willingness</el-link>
            </el-form-item>

          </el-form>
        </el-card>

      </el-col>
		</el-row>

    <el-drawer
      title="Personal Information"
      v-model="personal_info_drawer"
      direction="ltr"
      custom-class="demo-drawer"
      ref="drawer"
      size="50%"

    >

      <el-form label-width="200px" label-position="top">
        <el-form-item label="Age: ">
          <el-input v-model="adopter_info_form.age" style="width: 100px"></el-input>
        </el-form-item>
        <br>

        <el-form-item label="TEL: ">
          <el-input v-model="adopter_info_form.phoneNumber"></el-input>
        </el-form-item>

        <br>
        <el-form-item label="Email: ">
          <el-input v-model="adopter_info_form.email"></el-input>
        </el-form-item>

        <br>

        <el-form-item label="Income Level: ">
          <el-select v-model="potential_adopter_form.incomeLevel" placeholder="">
            <el-option v-for="items in optionsIncomeLevel" :key="items.value" :label="items.label" :value="items.value">

            </el-option>
          </el-select>
        </el-form-item>

        <br>
        <el-form-item label="Daily Schedule: ">
          <el-input type="textarea" v-model="potential_adopter_form.workStudySchedule"></el-input>
        </el-form-item>

        <br>

        <el-button type="info" round @click="personal_info_drawer=false">Back</el-button>
        <el-button type="primary" @click="onSubmitModification" round>Submit</el-button>
      </el-form>

    </el-drawer>




    <el-drawer
        title="Family Member Information"
        v-model="family_info_drawer"
        direction="ltr"
        custom-class="demo-drawer"
        ref="drawer"
        size="50%"
    >
      <el-form label-width="200px" label-position="top">
        <el-form-item label="Household Members: ">
          <el-input v-model="potential_adopter_form.householdMembers" style="width: 100px"></el-input>
        </el-form-item>
        <br>

        <el-form-item label="Do you have children in your residence? ">
          <el-radio v-model="potential_adopter_form.children" :label=true>Yes
          </el-radio>

          <el-radio v-model="potential_adopter_form.children" :label=false>No</el-radio>
        </el-form-item>

        <br>
        <el-form-item label="Do you have other pets in your residence? ">
          <el-radio v-model="potential_adopter_form.otherPets" :label=true>Yes
          </el-radio>

          <el-radio v-model="potential_adopter_form.otherPets" :label=false>No</el-radio>
        </el-form-item>

        <br><br>
        <el-form-item label="Your current family photo: ">
          <el-image :src="potential_adopter_form.family_photo" style="width: 50%"></el-image>
        </el-form-item>

        <br><br>

        <el-form-item label="Re-upload a family photo: " style="width: 100%">
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

        <br>

        <el-button type="info" round @click="family_info_drawer=false">Back</el-button>
        <el-button type="primary" @click="beforeSubmitFamily" round>Submit</el-button>

      </el-form>

    </el-drawer>

    <el-drawer
        title="Residence Information"
        v-model="residence_info_drawer"
        direction="ltr"
        custom-class="demo-drawer"
        ref="drawer"
        size="50%"
    >

      <el-form label-width="200px" label-position="top">
        <el-form-item label="Housing Type: ">
          <el-select v-model="potential_adopter_form.housingType" placeholder="">
            <el-option v-for="items in optionResidence" :key="items.value" :label="items.label" :value="items.value">
            </el-option>
          </el-select>
        </el-form-item>
        <br>

        <el-form-item label="Housing Stability: ">
          <el-radio-group v-model="potential_adopter_form.housingStability">
            <el-radio label="Owner">Owner</el-radio>
            <el-radio label="Temporal">Temporal</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Landlord Email: " v-if="potential_adopter_form.housingStability === 'Temporal'">
            <el-input v-model="potential_adopter_form.landlordContact"></el-input>
        </el-form-item>

        <br>
        <el-form-item label="Your current Living Room photo: ">
          <el-image :src="potential_adopter_form.living_room" style="width: 50%"></el-image>
        </el-form-item>

        <el-form-item label="Re-upload a Living room photo: " style="width: 100%">
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
        <br><br>

        <el-form-item label="Your current Balcony photo: ">
          <el-image :src="potential_adopter_form.balcony" style="width: 50%"></el-image>
        </el-form-item>

        <el-form-item label="Re-upload a balcony photo: " style="width: 100%">
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
        <br><br>

        <el-form-item label="Your current Garden photo: ">
          <el-image :src="potential_adopter_form.garden" style="width: 50%"></el-image>
        </el-form-item>

        <el-form-item label="Re-upload a Garden photo: " style="width: 100%">
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
        <br><br>

        <el-form-item label="Your current Kitchen photo: ">
          <el-image :src="potential_adopter_form.kitchen" style="width: 50%"></el-image>
        </el-form-item>

        <el-form-item label="Re-load a kitchen photo: " style="width: 100%">
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

        <el-button type="info" round @click="residence_info_drawer=false">Back</el-button>
        <el-button type="primary" @click="beforeSubmitResidence" round>Submit</el-button>


      </el-form>
    </el-drawer>


    <el-drawer
        title="Dog Care and Willingness"
        v-model="dog_care_drawer"
        direction="ltr"
        custom-class="demo-drawer"
        ref="drawer"
        size="50%"
    >

      <el-form label-width="200px" label-position="top">
        <el-form-item label="Pet Care Knowledge: ">
          <el-input type="textarea" v-model="potential_adopter_form.petCareKnowledge"></el-input>
        </el-form-item>
        <br>

        <el-form-item label="Daily activities after adoption: ">
          <el-input type="textarea" v-model="potential_adopter_form.dailyActivities"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="Adoption Purpose: ">
          <el-input type="textarea" v-model="potential_adopter_form.adoptionPurpose">
          </el-input>
        </el-form-item>
        <br>

        <el-form-item label="Preparation: ">
          <el-input type="textarea" v-model="potential_adopter_form.preparation"></el-input>
        </el-form-item>

      </el-form>
      <br>
      <el-button type="info" round @click="dog_care_drawer=false">Back</el-button>
      <el-button type="primary" @click="onSubmitModification" round>Submit</el-button>
    </el-drawer>




	</div>
</template>

<script>
import service from "../utils/request.ts";
import router from "../router/index.ts";

export default {
  data() {
    return {
      username: localStorage.getItem("ms_username"),
      imgurl : localStorage.getItem('ms_avatar'),
      firstname: localStorage.getItem('ms_firstName'),
      lastname: localStorage.getItem('ms_lastname'),
      job: localStorage.getItem('ms_job'),
      adopter_id: localStorage.getItem('ms_id'),
      password: localStorage.getItem('ms_password'),

      input_earlypsw: '',

      personal_info_drawer: false,
      family_info_drawer: false,
      residence_info_drawer: false,
      dog_care_drawer: false,

      fileList: [],
      fileListLiving: [],
      fileListKitchen: [],
      fileListBalcony: [],
      fileListGarden: [],

      temp_family: '',
      temp_garden: '',
      temp_balcony: '',
      temp_kitchen:'',
      temp_living: '',

      formPsw: {
        password: '',
        id: localStorage.getItem('ms_id')
      },

      adopter_info_form: [],
      potential_adopter_form: [],

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

  methods: {

    clear_fileList(){
      this.fileList = [];
      this.fileListGarden = [];
      this.fileListBalcony = [];
      this.fileListKitchen = [];
      this.fileListLiving = [];
    },

    beforeSubmitResidence(){
      this.potential_adopter_form.garden = this.temp_garden;
      this.potential_adopter_form.balcony = this.temp_balcony;
      this.potential_adopter_form.kitchen = this.temp_kitchen;
      this.potential_adopter_form.living_room = this.temp_living;
      this.onSubmitModification();
    },

    beforeSubmitFamily(){
      this.potential_adopter_form.family_photo = this.temp_family;
      this.onSubmitModification();
    },

    handleSuccess: function (response, file){
      this.temp_family= response.data;
      this.fileList.push(file);
    },

    handleRemove(file) {

      this.temp_family = ''
      this.fileList=[]
    },

    handleSuccessLiving: function (response, file){
      this.temp_living = response.data;
      this.fileListLiving.push(file);
    },

    handleRemoveLiving(file) {

      this.temp_living = ''
      this.fileListLiving=[]
    },

    handleSuccessBalcony: function (response, file){
      this.temp_balcony = response.data;
      this.fileListBalcony.push(file);
    },

    handleRemoveBalcony(file) {

      this.temp_balcony = ''
      this.fileListBalcony=[]
    },

    handleSuccessKitchen: function (response, file){
      this.temp_kitchen = response.data;
      this.fileListKitchen.push(file);
    },

    handleRemoveKitchen(file) {

      this.temp_kitchen = ''
      this.fileListKitchen=[]
    },

    handleSuccessGarden: function (response, file){
      this.temp_garden = response.data;
      this.fileListGarden.push(file);
    },

    handleRemoveGarden(file) {

      this.temp_garden = ''
      this.fileListGarden=[]
    },

    handleExceed(file, fileList){
      this.$message.warning("Please first delete the photo you uploaded previously!")
    },

    handlePreview(file) {
      console.log(file);
    },

    getPotentialAdopter(){
      service.get("api/adopter/" + this.adopter_id).then((res) => {
        this.potential_adopter_form = res.data.data
      });

    },

    getCustomer(){
      service.get("api/customer/"+ this.adopter_id).then((res) => {
        this.adopter_info_form = res.data.data;
        console.log(this.adopter_info_form)
      })
    },

    async onSubmitPassword() {

      if (this.input_earlypsw === this.password){
            try{
              const res =  await service.put('api/customer/edit', this.formPsw)
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
    },

    onSubmitModification(){
      service.put("api/customer/edit", this.adopter_info_form).then((result) => {
        service.put("api/adopter/edit", this.potential_adopter_form).then((res) => {
          if (res.data.msg === 'success' && result.data.msg === 'success'){
            this.$message({
              type:'success',
              message: 'Modified successfully'
            })
          }
          this.personal_info_drawer = false;
          this.family_info_drawer = false;
          this.residence_info_drawer = false;
          this.dog_care_drawer = false;
          this.clear_fileList();
        })
      })
          .catch((err) => {
        console.log("Error when editing information: {}", err)
      })
    }


  },


  mounted() {
    this.getPotentialAdopter();
    this.getCustomer();
    this.temp_family = this.potential_adopter_form.family_photo;
    this.temp_garden = this.potential_adopter_form.garden;
    this.temp_kitchen = this.potential_adopter_form.kitchen;
    this.temp_balcony = this.potential_adopter_form.balcony;
    this.temp_living = this.potential_adopter_form.living_room;
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

.drawer-form .el-form {
  /* 确保表单内容向左对齐 */
  text-align: center;
}

.drawer-form .el-form-item {
  /* 调整表单项的布局，确保标签和输入框左对齐 */
  margin-bottom: 20px; /* 根据需要调整间距 */
}

.el-form-item {
  display: flex; /* 使用 Flexbox 布局 */
  align-items: center; /* 垂直居中对齐 */
}

.el-form-item__label {
  white-space: nowrap; /* 防止标签换行 */
}

.el-form-item__content {
  flex-grow: 1; /* 输入框占据剩余空间 */
}
</style>

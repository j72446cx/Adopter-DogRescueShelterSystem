<template>
  <div>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-calendar v-model="currentDate" >
          <template #dateCell="{ data }">
            <p :class="data.isSelected ? 'is-selected' : ''">
              {{ data.day.split('-').pop()}}
              {{ data.isSelected ? (viewDaywork(data.day), '✔️') : '' }}
            </p>

<!--            <span v-if="todoList.medicationInfo.some(activity => activity.datetime.split('T')[0] === data.day)" class="medication-mark">💊</span>-->
<!--            <span v-if="hasActivityOnDate(data.day, this.todoList.medicationInfo)" class="medication-mark">💊</span>-->
<!--            <span v-if="hasActivityOnDate(data.date, 'groomingInfo')" class="grooming-mark">✂️</span>-->
<!--            <span v-if="hasActivityOnDate(data.date, 'exerciseInfo')" class="exercise-mark">🏃</span>-->
<!--            <span v-if="hasActivityOnDate(data.date, 'feedingInfo')" class="feeding-mark">🍽️</span>-->

          </template>
        </el-calendar>
      </el-col>

      <el-col :span="16">

        <!--    set 1-->

        <el-card shadow="hover" style="height: 203px" v-if="showCard">
          <template #header>
            <div class="clearfix">
              <span>Daily Feeding</span>
              <el-button style="float: right; padding: 3px 0" text>Add</el-button>
            </div>
          </template>

          <el-table ref="myTable" :show-header="false" :data="todoList.feedingInfo"  style="width: 100%" height="100px">
            <el-table-column width="40">
              <template #default="scope">
                <el-checkbox v-model="scope.row.status"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="scope">
                <div
                    class="todo-item"
                    :class="{
										'todo-item-del': scope.row.status
									}"
                >
                  <span>Feed the dog with id: {{ scope.row.dog_id}} with food type: {{scope.row.food_type}} and quantity: {{scope.row.quantity}} grams</span>

                </div>
              </template>
            </el-table-column>
          </el-table>

        </el-card>

        <br>

        <el-card shadow="hover" style="height: 203px" v-if="showCard">
          <template #header>
            <div class="clearfix">
              <span>Daily Exercise</span>
              <el-button style="float: right; padding: 3px 0" text>Add</el-button>
            </div>
          </template>

          <el-table ref="myTable" :show-header="false" :data="todoList.exerciseInfo"  style="width: 100%" height="100px">
            <el-table-column width="40">
              <template #default="scope">
                <el-checkbox v-model="scope.row.status"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="scope">
                <div
                    class="todo-item"
                    :class="{
										'todo-item-del': scope.row.status
									}"
                >
                  <span>Exercise type: {{scope.row.exerciseType}} scheduled on {{scope.row.date}} with duration {{scope.row.duration}} for dog id: {{scope.row.dog_id}}</span>

                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>


<!--        set 2-->
        <el-card shadow="hover" style="height: 203px" v-if="!showCard">
          <template #header>
            <div class="clearfix">
              <span>Medication schedule</span>
              <el-button style="float: right; padding: 3px 0" text>Add</el-button>
            </div>
          </template>

          <el-table ref="myTable" :show-header="false" :data="todoList.medicationInfo"  style="width: 100%" height="100px">
            <el-table-column width="40">
              <template #default="scope">
                <el-checkbox v-model="scope.row.status"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="scope">
                <div
                    class="todo-item"
                    :class="{
										'todo-item-del': scope.row.status
									}"
                >
                  <span>The dog with id: {{scope.row.dog_id}} should take {{scope.row.medication_name}} with dosage of {{scope.row.dosage}} at {{scope.row.startDate}}</span>

                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <br>

        <el-card shadow="hover" style="height: 203px" v-if="!showCard">
          <template #header>
            <div class="clearfix">
              <span>Grooming Schedule</span>
              <el-button style="float: right; padding: 3px 0" text>Add</el-button>
            </div>
          </template>

          <el-table ref="myTable" :show-header="false" :data="todoList.groomingInfo"  style="width: 100%" height="100px">
            <el-table-column width="40">
              <template #default="scope">
                <el-checkbox v-model="scope.row.status"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="scope">
                <div
                    class="todo-item"
                    :class="{
										'todo-item-del': scope.row.status
									}"
                >
                  <span>The dog with id {{scope.row.dog_id}} have a {{scope.row.type}} at {{scope.row.grooming_date}}</span>

                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <br>

        <el-button @click="this.toggleShowCard">Toggle Feeding and Exercise Cards</el-button>


      </el-col>


    </el-row>

  </div>
</template>

<script>
import service from "../utils/request.ts";

export default {
  data(){
    return{

      todoList: {
        medicationInfo: [],
        groomingInfo: [],
        exerciseInfo: [],
        feedingInfo: []
      },
      showCard : true,
      value : new Date(),
      dateFormatStart : '',
      dateFormatEnd: '',
      currentDate: new Date().toISOString().split('T')[0]

    }
  },
  methods: {

    fetchInfo: function (){
      const params1 = {
        medication_time_start : this.dateFormatStart,
        medication_time_end : this.dateFormatEnd
      }

      const params2 = {
        grooming_time_start : this.dateFormatStart,
        grooming_time_end : this.dateFormatEnd
      }

      const params3 = {
        exercise_time_start : this.dateFormatStart,
        exercise_time_end : this.dateFormatEnd
      }

      const params4 = {
        feeding_time_start : this.dateFormatStart,
        feeding_time_end : this.dateFormatEnd
      }

      service.get('/api/interaction/getMedication', {params:params1})
          .then((res) => {
            this.todoList.medicationInfo = res.data.data.rows;
      }).catch(()=>{
        console.error("Fetch medication info failed")});
      service.get('/api/interaction/getGrooming', {params:params2})
          .then((res) => {this.todoList.groomingInfo = res.data.data.rows;}).catch(()=>{
        console.error("Error fetching grooming info")});
      service.get('/api/interaction/getExercise', {params:params3})
          .then((res) => {this.todoList.exerciseInfo = res.data.data.rows;}).catch(()=>{
        console.error("Error fetching exercise info")
      });
      service.get('/api/interaction/getFeed', {params:params4})
          .then((res) => {
            this.todoList.feedingInfo = res.data.data.rows;
          }
          ).catch(()=>{
        console.error("Error fetching feed info")
      });
    },

    toggleShowCard: function (){
      this.showCard = !this.showCard;
    },

    viewDaywork: function (data){
      this.dateFormatStart = data;
      let date = new Date(data);
      date.setDate(date.getDate() + 1);
      this.dateFormatEnd = date.toISOString().split('T')[0];

      this.fetchInfo();
    },

    hasActivityOnDate: function (date, activityType){

      return activityType.some(activity => {
        let activityDate = activity.datetime.split('T')[0];
        return activityDate === date;
      })
    }

  },
  mounted() {
    this.fetchInfo();
  }
}

</script>

<style scoped>
.is-selected {
  color: #1989FA;
}
</style>

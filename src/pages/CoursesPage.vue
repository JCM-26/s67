<script>
	import CourseComponent from '../components/CourseComponent.vue'
	import api from '../api';

  import { ref, reactive, onMounted, onBeforeMount, watch } from 'vue';
  /* ACTIVITY SOLUTION START */
  import UserView from '../components/UserView.vue';
  import AdminView from '../components/AdminView.vue';
  /* ACTIVITY SOLUTION END */

  import { useGlobalStore } from '../stores/global.js';

    export default {
    	components: {
    		CourseComponent,
		    /* ACTIVITY SOLUTION START */
        UserView,
        AdminView
        /* ACTIVITY SOLUTION END */
    	},
    	
    	setup(){

    		/* ACTIVITY SOLUTION START */
      	const { user } = useGlobalStore();
        /* ACTIVITY SOLUTION END */

    		
    		const courses = reactive({data:[]});

    		async function fetchCourses() {
                if(user.isAdmin) {
                    let { data } = await api.get('/courses/all');
                    courses.data = data;
                } else {
                    let { data } = await api.get('/courses');
                    courses.data = data;
                }
    		}

    		//onBeforeMount(async () => {
    		//	let {data} = await api.get('/courses')
    		//	courses.data = data;
    		//})
    		watch([user], fetchCourses, { immediate: true })

    		return {
    			courses,
    			user,
    			fetchCourses
    		}
    	}
    }

</script>

<template>
	<div class="container">
      <!-- ACTIVITY SOLUTION START -->
      <AdminView v-if="user.isAdmin" :coursesData="courses.data" @archived="fetchCourses" />
      <UserView v-if="!user.isAdmin" :coursesData="courses.data" />
      <!-- ACTIVITY SOLUTION END -->
	</div>
</template>
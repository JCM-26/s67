<template>
    <div class="container">
        <div class="row mx-auto my-5 gap-4 gap-md-0">
            <div class="col-md-6">
                <!-- placehold.co will generate a placeholder image based on the text provided -->
                <img 
                    class="img-fluid rounded" 
                    :src="`https://placehold.co/600x400/63c3ff/ffffff?font=raleway&text=${encodeURIComponent(course.data.name)}`"
          
                >
            </div>
            <div class="col-md-6">
                <div class="d-flex gap-2 text-primary">
                    <h1 class="bi bi-mortarboard"></h1>
                    <h1 class="mb-3">{{course.data.name}}</h1>
                </div>
                <h6>Course Description:</h6>
                <p class="text-muted">{{course.data.description}}</p>
                <p>Price: PHP {{course.data.price}}</p> 

                <button class="btn btn-primary" type="button" v-if="user.email && !user.isAdmin" @click="handleEnroll">Enroll</button>

                <button class="btn btn-warning" type="button" v-if="user.email && user.isAdmin" disabled>Admins are not allowed to enroll</button>

                <router-link to="/login" class="btn btn-danger" type="button" v-if="!user.email">Login to Enroll</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
	import { onBeforeMount, reactive } from 'vue';
	import { useRoute, useRouter } from 'vue-router';
	import api from '../api';
	import { useGlobalStore } from '../stores/global';
	import {Notyf} from 'notyf';

	const notyf = new Notyf();
	const {user} = useGlobalStore();
	const router = useRouter();
	const course = reactive({data: null});

	async function handleEnroll(){
		let {data} = await api.post(`/enrollments/enroll`,{
			enrolledCourses: [
				{
					courseId: course.data._id
				},
			],
			totalPrice: course.data.price
		});
		if(data.success === true){
			notyf.success("Course Enrolled!")
			router.push({path: '/courses'});
		} else {
			notyf.error("Enrollment Failed.")
		}
	}

	onBeforeMount(async ()=> {
		const route = useRoute();

		let {data} = await api.get(`/courses/specific/${route.params.id}`);
		course.data = data;
	})
	
</script>
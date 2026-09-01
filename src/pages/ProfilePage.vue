<script setup>
	import { onBeforeMount } from "vue";
	import { useRouter } from "vue-router";
	import { useGlobalStore } from "../stores/global.js";
	import ResetPassword from "../components/ResetPassword.vue";

	const { user } = useGlobalStore();

	const router = useRouter();

	onBeforeMount(() => {
		if(!user.email) {
			router.push({ path: '/'})
		}
	});
</script>

<template>
	<div class="container-fluid" v-if="user.email">
		<h1 class="my-5 pt-3 text-primary text-center">Profile Page</h1>
		<div class="row d-flex justify-content-center">
			<div class="col-md-5 border rounded-3 mx-auto p-5">
				<h2 className="mt-3">{{user.firstName + ' ' +  user.lastName}}</h2>
				<hr>
				<h4>Contacts</h4>
				<ul>
					<li>Email: {{user.email}}</li>
					<li>Mobile No: {{user.mobileNo}}</li>
				</ul>
			</div>
		</div>
		<!-- Add reset password component -->
		<ResetPassword />
	</div>
</template>
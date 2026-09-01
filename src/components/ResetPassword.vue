<template>
	<div class="container mt-5">
		<div class="row justify-content-center">
			<div class="col-md-6">
				<div class="card shadow-sm">
					<div class="card-body">
						<h3 class="card-title mb-4">Update Profile</h3>
						<form @submit.prevent="handleReset">
							<div class="mb-3">

								<label for="firstName" class="form-label">First Name</label>
								<input type="password" id="firstName" v-model="newPassword" class="form-control" required>

								<label for="lastName" class="form-label">Last Name</label>
								<input type="password" id="lastName" v-model="newPassword" class="form-control" required>

								<label for="mobileNo" class="form-label">Mobile No</label>
								<input type="password" id="mobileNo" v-model="newPassword" class="form-control" required>

								<button type="submit" class="btn btn-primary w-100 my-2" :disabled="isLoading">{{ isLoading ? "Updating..." : "Update Profile"}}</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>

		<div class="row justify-content-center">
			<div class="col-md-6">
				<div class="card shadow-sm">
					<div class="card-body">
						<h3 class="card-title mb-4">Reset Password</h3>
						<form @submit.prevent="handleReset">
							<div class="mb-3">
								<label for="newPassword" class="form-label"> New Password</label>
								<input type="password" id="newPassword" v-model="newPassword" class="form-control" required>
								<button type="submit" class="btn btn-primary w-100 my-2" :disabled="isLoading">{{ isLoading ? "Resetting..." : "Reset Password"}}</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref } from "vue";
	import { Notyf } from "notyf";
	import { useGlobalStore } from "../stores/global";
	import api from "../api";

	const notyf = new Notyf();

	const newPassword = ref("");
	const isLoading = ref(false);

	const handleReset = async() => {
		try {
			isLoading.value = true;

			const { user } = useGlobalStore();

			if(!user.token) {
				notyf.error("You are not authorized");
				isLoading.value = false;
				return;
			}

			let res = await api.put("/users/reset-password", {
				newPassword: newPassword.value
			});

			console.log(res);
			notyf.success("Password reset successfully");
			newPassword.value = "";

		} catch (e) {
			console.log(e)
			//e.response?.data?.message - optional chaining
			const msg = e.response?.data?.message || "Password reset failed";
			//const msg = e.response && e.response.data && e.response.message
			notyf.error(msg);
		} finally {
			isLoading.value = false;
		}
	}
</script>
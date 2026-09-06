<template>
	<div class="container mt-5">
		<div class="row justify-content-center">
			<div class="col-md-6">
				<div class="card shadow-sm">
					<div class="card-body">
						<h3 class="card-title mb-4">Update Profile</h3>
						<form @submit.prevent="handleUpdate">
							<div class="mb-3">
								<label for="firstName" class="form-label">First Name</label>
								<input type="text" id="firstName" v-model="firstName" class="form-control" required>
							</div>

							<div class="mb-3">
								<label for="lastName" class="form-label">Last Name</label>
								<input type="text" id="lastName" v-model="lastName" class="form-control" required>
							</div>

							<div class="mb-3">
								<label for="mobileNo" class="form-label">Mobile No</label>
								<input type="text" id="mobileNo" v-model="mobileNo" class="form-control" required>
							</div>

							<button type="submit" class="btn btn-primary w-100 my-2" :disabled="isLoading">{{ isLoading ? "Updating..." : "Update Profile"}}</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, onBeforeMount } from "vue";
	import { Notyf } from "notyf";
	import { useGlobalStore } from "../stores/global";
	import api from "../api";

	const notyf = new Notyf();
	const { user } = useGlobalStore();

	const firstName = ref("");
	const lastName = ref("");
	const mobileNo = ref("");
	const isLoading = ref(false);

	// Pre-fill the form with the currently logged in user's details
	onBeforeMount(() => {
		firstName.value = user.firstName || "";
		lastName.value = user.lastName || "";
		mobileNo.value = user.mobileNo || "";
	});

	const handleUpdate = async () => {
		try {
			isLoading.value = true;

			if (!user.token) {
				notyf.error("You are not authorized");
				isLoading.value = false;
				return;
			}

			// firstName, lastName and mobileNo are sent in the request body
			// the token is added to the request headers
			let res = await api.put("/users/profile", {
				firstName: firstName.value,
				lastName: lastName.value,
				mobileNo: mobileNo.value
			}, {
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			});

			// keep the store in sync with the updated profile
			user.firstName = res.data.firstName;
			user.lastName = res.data.lastName;
			user.mobileNo = res.data.mobileNo;

			notyf.success("Profile updated successfully");
		} catch (e) {
			console.log(e);
			const msg = e.response?.data?.message || "Profile update failed";
			notyf.error(msg);
		} finally {
			isLoading.value = false;
		}
	}
</script>

<template>
    <div class="container-fluid">
        <h1 class="my-5 pt-3 text-primary text-center">Register Page</h1> 
        <div class="row d-flex justify-content-center">
            <div class="col-md-5 border border rounded-3 mx-auto p-5">
                <form v-on:submit="handleSubmit">
                    <div class="mb-3">
                        <label for="fName" class="form-label">First Name</label>
                        <input type="text" class="form-control" id="fName" v-model="firstName" />
                    </div>
                    <div class="mb-3">
                        <label for="lName" class="form-label">Last Name</label>
                        <input type="text" class="form-control" id="lName" v-model="lastName" />
                    </div>
                    <div class="mb-3">
                        <label for="mobile" class="form-label">Mobile Number</label>
                        <input type="text" class="form-control" id="mobile" v-model="mobileNum" />
                    </div>
                    <div class="mb-3">
                        <label for="emailInput" class="form-label">Email Address</label>      
                        <input type="email" class="form-control" id="emailInput" v-model="email" />
                    </div>
                    <div class="mb-3">
                        <label for="passwordInput" class="form-label">Password</label>
                        <input type="password" class="form-control" id="passwordInput" v-model="password" />
                    </div>
                    <div class="mb-3">
                        <label for="cpasswordInput" class="form-label">Confirm Password</label>
                        <input type="password" class="form-control" id="cpasswordInput" v-model="confirmPass" />
                    </div>
                    <div class="d-grid mt-5">
                        <button type="submit" class="btn btn-primary btn-block" v-if="isEnabled">Submit</button>
                        <button type="submit" class="btn btn-danger btn-block" disabled v-else>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<!-- 
    <script setup> is a new feature introduced in Vue 3 that eases the use of Composition API in an SFC.

    It allows us to define the component's props, reactive data, computed properties, and methods in a single block, making it easier to read and understand the component code. 

    It also automatically exposes our top-level bindings which means we don't have to add a return to expose our reactive states, methods to the template. We simply have to declare them. 
-->
<script setup>
	
	import { watch, ref, onBeforeMount } from 'vue';
	import { Notyf } from 'notyf';
    import { useRouter } from 'vue-router';
    import { useGlobalStore } from '../stores/global'
    import api from '../api.js';

    const router = useRouter();
    const { user } = useGlobalStore();

    const firstName = ref("");
    const lastName = ref("");
    const mobileNum = ref("");
	const email = ref("");
	const password = ref("");
	const confirmPass = ref("");
	const isEnabled = ref(false);

	const notyf = new Notyf();

	watch([email,password,confirmPass,firstName, lastName, mobileNum], (currentValue, oldValue) => {
		if(currentValue.every(input => input !== "") && currentValue[1] === currentValue[2]){
			isEnabled.value = true
		} else {
			isEnabled.value = false
		}
	});

	async function handleSubmit(e){
		e.preventDefault();

        try {
            await api.post('/users/check-email', {
                email: email.value
            })

            let response = await api.post('/users/register', {
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                mobileNo: mobileNum.value,
                password: password.value
            })

            if(response.status === 201){

                notyf.success("Registration Successful");

                firstName.value = "";
                lastName.value = "";
                mobileNum.value = ""
                email.value = "";
                password.value = "";
                confirmPass.value = "";

                router.push({path: '/login'})
            } else {
                notyf.error("Registration Failed. Please contact administrator.")
            }
        } catch(e){
            if(e.response.status === 404 || e.response.status === 401 || e.response.status === 400 || e.response.status === 409) {
                notyf.error(e.response.data.message);
            } else {
                console.error(e);
                notyf.error("Registration Failed. Please contact admin.")
            }
        }
	}

    onBeforeMount(() => {
        if(user.token){
            router.push({path: '/courses'})
        }
    })
</script>
<script setup>

    import { watch, ref, onBeforeMount } from 'vue';
    import { Notyf } from 'notyf';
    import { useGlobalStore } from '../stores/global';
    import { useRouter } from 'vue-router';
    import api from '../api';

    const router = useRouter();
    const {getUserDetails, user} = useGlobalStore();

    const email = ref("");
    const password = ref("");
    const isEnabled = ref(false);

    const notyf = new Notyf();

    watch([email,password], (currentValue, oldValue) => {

        if(currentValue.every(input => input !== "")){
            isEnabled.value = true
        } else {
            isEnabled.value = false
        }
    });

 //update handleSubmit as an async function so we can use await inside it. This is done to ensure that the request-response cycle is finished before the other tasks are performed.
    async function handleSubmit(e){
        e.preventDefault();

        try {
        //Use axios() to create an HTTP request to our server at localhost:4000.
            //We use await to receive the response as an object because axios() returns a Promise.
            let res = await api.post('/users/login', {
                email: email.value,
                password: password.value
            })

            if(res.data){
                notyf.success("Login Successful");

                localStorage.setItem("token", res.data.access)

                getUserDetails(res.data.access)

                email.value = "";
                password.value = "";

                router.push({path: '/courses'})

            }
        } catch(e) {
            if(e.res.status === 404 || e.res.status === 401 || e.res.status === 400){
                notyf.error(e.res.data.message)
            } else {
                notyf.error("Login Failed. Please contact administrator.")
            }
        }
  
    }

    onBeforeMount(() => {
        if(user.token){
            router.push({path: "/courses"})
        }
    })
</script>

<template>
    <div class="container-fluid">
        <h1 class="my-5 pt-3 text-primary text-center">Login Page</h1> 
        <div class="row d-flex justify-content-center">
            <div class="col-md-5 border border rounded-3 mx-auto p-5">
                <form v-on:submit="handleSubmit">
                    <div class="mb-3">
                        <label for="emailInput" class="form-label">Email Address</label>
                        <input type="email" class="form-control" id="emailInput" v-model="email" />
                    </div>
                    <div class="mb-3">
                        <label for="passwordInput" class="form-label">Password</label>
                        <input type="password" class="form-control" id="passwordInput" v-model="password" />
                    </div>
                    <div class="d-grid mt-5">
                        <button type="submit" class="btn btn-primary btn-block"  v-if="isEnabled">Login</button>
                        <button type="submit" class="btn btn-danger btn-block" disabled v-else>Login</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
import { defineStore } from 'pinia';
import { reactive } from 'vue';
import api from '../api'


export const useGlobalStore = defineStore('global',() => {
    
    let user = reactive({
        token: localStorage.getItem('token'),
        email: null,
        isAdmin: null
    })


    
    async function getUserDetails(token){

        if(!token){
            user.token = null;
            user.email = null;
            user.isAdmin = null

            return
        }
        //data was destructured from the response object instead.
        //axios.get() is an alias of the axios() method.
        //It is a shortcut to creating an axios get request. This will no longer need us to add the method of the request.
        //Instead it takes 3 arguments. The url, the data (body),options(headers)
        //The url is a string and is the route to the resource.
        //data is an object which acts as the request body.
        //options is an object that can contain the headers.
        //axios.get(url,data,options)

        let {data} = await api.get('/users/details', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        user.token = token;
        user.email = data.email;
        user.isAdmin = data.isAdmin;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.mobileNo = data.mobileNo;
    }


    
    return {
        user,
        getUserDetails
    }
})
<template>
    <div class="container my-5" style="max-width: 500px">
        <h1 class="text-center">Edit Course</h1>
        <form v-on:submit.prevent="handleSubmit">
            <div class="mb-3">
                <label for="courseNameInput" class="form-label">Course Name</label>
                <input type="text" class="form-control" id="courseNameInput" v-model="name" />
            </div>
            <div class="mb-3">
                <label for="courseDescription" class="form-label">Description</label>
                <textarea
                    class="form-control"
                    id="courseDescription"
                    v-model="description"
                    rows="5"
                ></textarea>
            </div>
            <div class="mb-3">
                <label for="coursePrice" class="form-label">Price</label>
                <input type="number" class="form-control" id="coursePrice" v-model="price" />
            </div>
            <button type="submit" class="btn btn-primary" v-if="isEnabled">Save Changes</button>
            <button type="submit" class="btn btn-danger" disabled v-else>Save Changes</button>
        </form>
    </div>
</template>

<script setup>
    import { ref, onBeforeMount, watch } from "vue";
    import { Notyf } from "notyf";
    import { useRoute, useRouter } from "vue-router";
    import { useGlobalStore } from "../stores/global";
    import api from "../api";

    const notyf = new Notyf();
    const route = useRoute();
    const router = useRouter();
    const { user } = useGlobalStore();

    // the course id is passed in the params of the route (/courses/:courseId/edit)
    const courseId = route.params.courseId;

    const name = ref("");
    const description = ref("");
    const price = ref(0);
    const isEnabled = ref(false);

    async function handleSubmit() {
        const course = {
            name: name.value,
            description: description.value,
            price: price.value,
        };

        try {
            // PATCH request to update the course, courseId comes from the route params,
            // (the demo-API registers this route as PATCH, not PUT)
            // the token is added to the headers automatically by the api instance
            const response = await api.patch(`/courses/${courseId}`, course, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });

            if (response.status === 200) {
                notyf.success(response.data.message || "Course updated successfully");
                router.push({ path: "/courses" });
            } else {
                notyf.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            notyf.error(error.response?.data?.message || "Error updating course. Please contact administrator.");
        }
    }

    watch([name, description, price], (currentValue) => {
        isEnabled.value = currentValue.every((input) => input !== "" && input !== null);
    });

    onBeforeMount(async () => {
        if (!user.token || !user.isAdmin) {
            router.push({ path: "/courses" });
            return;
        }

        try {
            // pre-fill the form with the course's current details
            const { data } = await api.get(`/courses/specific/${courseId}`);
            name.value = data.name;
            description.value = data.description;
            price.value = data.price;
        } catch (error) {
            console.error(error);
            notyf.error("Unable to load course details.");
        }
    });
</script>

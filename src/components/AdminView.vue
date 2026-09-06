<!-- ACTIVITY SOLUTION START -->
<template>
    <h1 class="text-center text-primary mt-5">Admin Dashboard</h1>
    <table class="table table-striped border">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Availability</th>
                <th colspan="2">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="course in coursesData" :key="course._id">
                <td>{{ course._id }}</td>
                <td>{{ course.name }}</td>
                <td>{{ course.description }}</td>
                <td>{{ course.price }}</td>
                <td>
                    <span v-if="course.isActive" class="text-success">Available</span>
                    <span v-else class="text-danger">Unavailable</span>
                </td>
                <td>
                    <button class="btn btn-primary" @click="handleEdit(course._id)">Edit</button>
                </td>
                <td>
                    <button class="btn btn-danger" :disabled="!course.isActive" @click="handleArchive(course._id)">Archive</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
    import { defineProps, defineEmits } from "vue";
    import { useRouter } from "vue-router";
    import { Notyf } from "notyf";
    import { useGlobalStore } from "../stores/global";

    const props = defineProps({
        coursesData: Array,
    });

    // let the parent (CoursesPage) know a course was archived so it can refresh the table
    const emit = defineEmits(["archived"]);

    const router = useRouter();
    const notyf = new Notyf();
    const { user } = useGlobalStore();

    // navigate to the edit page, the course id is passed in the route params
    function handleEdit(courseId) {
        router.push({ path: `/courses/${courseId}/edit` });
    }

    // PATCH request (via fetch) to archive the course, the course id is passed in the route params
    // (the demo-API registers this route as PATCH, not DELETE)
    async function handleArchive(courseId) {
        try {
            const response = await fetch(`${import.meta.env.VITE_COURSE_BOOKING_API}/courses/${courseId}/archive`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                notyf.success(data.message || "Course archived successfully");
                emit("archived");
            } else {
                notyf.error(data.message || "Failed to archive course");
            }
        } catch (error) {
            console.error(error);
            notyf.error("Failed to archive course");
        }
    }
</script>
<!-- ACTIVITY SOLUTION END -->
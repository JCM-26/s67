
<!-- 
  What is a component? 
    A component is a reusable part of an application.

  What is a VueJS Component?
    A VueJS component is an independent reusable part of an application. In VueJS, components are usually created with the concept of Single-File Component (SFC) which simply means that in VueJS, a component holds the HTML code, JS Script and CSS altogether in a file with a .vue extension instead of having and keeping separate files for each.

  An SFC consists of three parts:
    1. Template
    2. Script
    3. Style

  This provides a convenient way to organize and reuse components in a declarative and modular way. They also allow for better separation of concerns, making it easier to reason about the functionality and styling of a component
-->
<!-- Each SFC block consists of HTML-like tags that encapsulates the block. They can be in any order. -->


<script>
  //export default allows us to define the components registration and its properties using Options API or Composition API. 
  //Options API was first used in VueJS Development and is mostly used for smaller scaled applications. Composition API was added in Vue 3.
  //Defining the props property using the Options API will allow components to be completely reusable. It will allow us to pass data from a parent component to a child component.
  export default {
    //props property is from the Options API that allow us to define the props that can be passed to a component
    props: {
      //When defining the props of a component, add the name of the props and its data type.
      //VueJS will check the data type of the value passed as a prop to this component.
      //We will replace the hardcoded text in our template to details/data passed from the parent.
      bannerProps: Object
    },
    //mounted() method can be added which is a function/method that will run when the component is mounted.
    //A component is mounted when it is displayed and updated into the DOM
    mounted(){
      console.log(this.bannerProps.title);
      console.log(this.bannerProps.tagline);
    }
  }
</script>

<template>
  <!-- Double Moustaches {{}} are used to embed JS Expressions. It is able to display the values of exposed variables, or JS Expressions.
  In Vue.js, an exposed variable is a property that is defined within the component's data object and can be accessed by the component's template or methods. -->
  <div class="container">
    <div class="row mb-5 py-5" id="banner">
      <div class="col-md-10 p-5 ms-5">
        <h1 class="mb-3" id="banner-title">{{bannerProps.title}}</h1>
        <p class="mb-5" id="motto">
          {{bannerProps.tagline}}
        </p>
        <router-link class="btn btn-primary btn-lg rounded-pill px-3" :to="{ name: bannerProps.destination }">{{bannerProps.buttonLabel}} <i class="bi bi-arrow-right"></i></router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <PredictSelectForm></PredictSelectForm>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import PredictSelectForm from '@/components/SinglePredictSelectForm.vue';

export default {
  name: 'Home',
  components: {
    PredictSelectForm,
    HelloWorld,
  },
};
</script>

<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <Header></Header>

    <main role="main">
      <router-view/>
    </main>

    <Footer></Footer>
  </div>
</template>

<script>
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';

export default {
  name: 'AssetLayout',
  components: { Header, Footer },
};
</script>

<style scoped>

</style>

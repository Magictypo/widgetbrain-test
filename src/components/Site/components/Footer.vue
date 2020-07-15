<template>
  <div class="container-fluid">
    <footer class="border-top pt-2">
      <div class="row">
        <div class="col-12 col-md">
          <small class="d-block mb-3 text-muted">&copy;{{year}}</small>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      year: 2020,
    };
  },
};
</script>

<style scoped>
</style>

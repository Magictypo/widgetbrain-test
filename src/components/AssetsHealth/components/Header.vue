<template>
  <div class="card-header">
    Asset Overview
    <i class="fa fa-arrow-right mx-1" aria-hidden="true"></i>
    <i class="fa fa-dot-circle-o mx-1" aria-hidden="true"></i>
    {{ assetsName }}
    <i class="fa fa-map-marker pull-right" aria-hidden="true"></i>
  </div>
</template>
<script>
export default {
  name: 'AssetsHeader',
  data() {
    return {
      assetsName: 'Master Station 1-1',
    };
  },
};
</script>

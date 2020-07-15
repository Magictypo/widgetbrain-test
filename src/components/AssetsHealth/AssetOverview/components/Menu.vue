<template>
  <div class="row">
    <div class="col-md-12">
      <div class="nav-scroller" style="margin-top: -20px;">
        <nav class="nav">
          <a class="p-2 text-muted" href="#">EVENTS</a>
          <a class="p-2 text-muted" href="#">POSITION</a>
          <a class="p-2 text-muted" href="#">TRAVEL TIME</a>
          <a class="p-2 text-muted active" href="#">TORQUE PROFILE</a>
          <a class="p-2 text-muted" href="#">WORK ORDERS</a>
          <a class="p-2 text-muted" href="#">ALARM ANALYTICS</a>
        </nav>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AssetsOverviewMenuTab',
};
</script>

<style lang="scss" scoped>
.text-muted.active {
  border-bottom: 4px solid #777777;
}
</style>

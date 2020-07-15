<template>
  <div>
    <div class="nav" style="margin: -16px -15px; color: #eeeeee">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <a class="nav-link" href="#">
            <i class="fa fa-arrow-left pl-3 mx-1" aria-hidden="true"></i>
            Terminal Overview
          </a>
        </li>
      </ul>
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="#">
            <i class="fa fa-bars mx-3" aria-hidden="true"></i>
          </a>
        </li>
      </ul>
    </div>
    <hr style="margin-left: -15px; margin-right: -15px;" class="mb-0">
    <div class="row">
      <img src="src/assets/img/pump.jpg" width="100%" alt="">
    </div>
    <div class="mt-3">
      <span>Terminal Name</span>
      <h3>{{ terminalName }}</h3>

      <span>Country Code</span>
      <h3>{{ countryCode }}</h3>

      <span>Address</span>
      <h4>{{ address }}</h4>
      <i class="fa fa-map-marker pull-right fa-2x mt-5" aria-hidden="true"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AssetsHealthSidebar',
  data() {
    return {
      terminalName: 'West',
      countryCode: 'NLD',
      address: '',
    };
  },
};
</script>

<template>
  <div id="assets-wrapper" role="main">
    <div class="container-fluid">
      <div class="row">
        <div class="col-2 py-3" style="border-right: 1px solid #ccc;">
          <Sidebar></Sidebar>
        </div>
        <div class="col-10 py-3">
          <div class="card">
            <Header/>
            <div class="card-body">
              <TabMenu></TabMenu>
              <TorqueProfile></TorqueProfile>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TorqueProfile from './components/TorqueProfile.vue';
import Sidebar from './components/Sidebar.vue';
import TabMenu from './components/TabMenu.vue';
import Header from './components/Header.vue';

export default {
  name: 'AssetsDetail',
  components: {
    TorqueProfile,
    Header,
    TabMenu,
    Sidebar,
  },
};
</script>

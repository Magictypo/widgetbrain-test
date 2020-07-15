<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div id="assetsOverview-wrapper" role="main">
    <div class="container-fluid">
      <div class="row">
        <div class="col-2 py-3" style="border-right: 1px solid #ccc;">
          <AssetsSidebar></AssetsSidebar>
        </div>
        <div class="col-10 py-3">
          <div class="card">
            <AssetsHeader/>
            <div class="card-body">
              <AssetsMenuTab></AssetsMenuTab>
              <router-view/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AssetsSidebar from './components/Sidebar.vue';
import AssetsMenuTab from './components/Menu.vue';
import AssetsHeader from './components/Header.vue';

export default {
  name: 'AssetsOverviewLayout',
  components: {
    AssetsHeader,
    AssetsMenuTab,
    AssetsSidebar,
  },
};
</script>

<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <Header></Header>

    <main role="main">
      <div class="container-fluid">
        <div class="row">
          <div class="col-2 py-3" style="border-right: 1px solid #ccc;">
            <AssetsSidebar></AssetsSidebar>
          </div>
          <div class="col-10 py-3">
            <div class="card">
              <AssetsHeader/>
              <div class="card-body">
                <AssetsTab></AssetsTab>
                <router-view/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer></Footer>
  </div>
</template>

<script>
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';
import AssetsSidebar from '@/components/assetsHealth/sidebar.vue';
import AssetsTab from '@/components/assetsHealth/topMenuTab.vue';
import AssetsHeader from '@/components/assetsHealth/header.vue';

export default {
  name: 'AssetLayout',
  components: {
    AssetsHeader,
    AssetsTab,
    AssetsSidebar,
    Header,
    Footer,
  },
};
</script>

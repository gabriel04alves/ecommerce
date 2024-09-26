<template>
  <div id="app" class="is-flex">
    <ProductList />
  </div>
</template>

<script>
import ProductList from "./components/ProductList.vue";

export default {
  name: "App",
  components: {
    ProductList,
  },
};
</script>

<style>
div {
  width: 100vw;
}
</style>

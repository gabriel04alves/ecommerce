<template>
  <div class="container">
    <h1 class="title">Lista de produtos</h1>
    <div v-if="loading" class="notification is-info">Loading products...</div>
    <div v-if="error" class="notification is-danger">{{ error }}</div>
    <div class="table-container">
      <table
        class="table is-bordered is-striped is-fullwidth"
        v-if="!loading && !error"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Tags</th>
            <th>Criado</th>
            <th>Atualizado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.description }}</td>
            <td>{{ formatCurrency(product.price) }}</td>
            <td>{{ product.tags }}</td>
            <td>{{ formatDate(product.createdAt) }}</td>
            <td>{{ formatDate(product.updatedAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getProducts } from "../services/getProducts";

export default {
  name: "ProductList",
  setup() {
    const products = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const fetchProducts = async () => {
      loading.value = true;
      try {
        const response = await getProducts();
        products.value = response.data.map((product) => ({
          ...product,
          price: parseFloat(product.price),
        }));
      } catch (err) {
        error.value = "Failed to load products";
        console.error("Error fetching products:", err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchProducts();
    });

    const formatCurrency = (value) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value || 0);
    };

    const formatDate = (dateString) => {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      return new Date(dateString).toLocaleDateString("pt-BR", options);
    };

    return {
      products,
      loading,
      error,
      formatCurrency,
      formatDate,
    };
  },
};
</script>

<style scoped>
tr,
th {
  text-align: center;
}
th {
}
.notification {
  margin-bottom: 1rem;
}
</style>

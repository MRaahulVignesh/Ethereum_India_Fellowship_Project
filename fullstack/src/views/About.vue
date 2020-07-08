<template>
  <div class="Main">
    <navbar></navbar>
    <br/>
    <cards></cards>
  </div>
</template>

<script>
// @ is an alias to /src
import cards from '@/components/Cards.vue'
import navbar from '@/components/Navbar.vue'

export default {
  components: {
    navbar,
    cards
  }
};
</script>
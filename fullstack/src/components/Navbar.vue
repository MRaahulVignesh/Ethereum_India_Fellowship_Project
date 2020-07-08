<template>
  <div>
    <b-navbar toggleable sticky type="dark" variant="dark">
      <b-navbar-brand href="#">Menu Control</b-navbar-brand>

      <b-navbar-toggle target="navbar-toggle-collapse">
        <template v-slot:default="{ expanded }">
          <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
          <b-icon v-else icon="chevron-bar-down"></b-icon>
        </template>
      </b-navbar-toggle>

      <b-collapse id="navbar-toggle-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="/profile/">Profile</b-nav-item>
          <b-nav-item href="/about">Blog Posts</b-nav-item>
          <b-nav-item href="/addblog">Add Blog</b-nav-item>
          <b-nav-item href="/">Sign Out</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
<script>
export default {

};
</script>

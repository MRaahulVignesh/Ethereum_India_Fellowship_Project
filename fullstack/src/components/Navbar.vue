<template>
  <div>
    <b-navbar toggleable sticky type="dark" variant="dark">
      <b-navbar-brand href="#">Menu Control</b-navbar-brand>

      <b-nav-form class="ml-auto mr-4">
          <b-form-input size="sm" class="mr-sm-0" placeholder="Search"></b-form-input>
          <b-button size="sm" class="my-0 my-sm-0" type="submit" >Search</b-button>
        </b-nav-form>

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

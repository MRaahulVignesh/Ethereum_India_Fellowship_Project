<template>
  <div class="Main">
     <div>
    <b-navbar toggleable sticky type="dark" variant="dark">
      <b-navbar-brand href="#">Blog Posts</b-navbar-brand>

      <b-nav-form class="ml-auto mr-4">
          <b-form-input size="sm" class="mr-sm-0" placeholder="Search" v-model="search"></b-form-input>
        </b-nav-form>

      <b-navbar-toggle target="navbar-toggle-collapse">
        <template v-slot:default="{ expanded }">
          <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
          <b-icon v-else icon="chevron-bar-down"></b-icon>
        </template>
      </b-navbar-toggle>

      <b-collapse id="navbar-toggle-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="/about">Blog Posts</b-nav-item>
          <b-nav-item href="/addblog">Add Blog</b-nav-item>
          <b-nav-item href="/">Sign Out</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
    <br/>
    <b-container>
    <div v-if="blogPosts.length">
      <b-row>
        <div v-bind:key="data.index" v-for="data in blogPosts">
          <b-col l="4">
            <b-card
              :title="data.title"
              :img-src="imgsrc"
              img-alt="Image"
              img-top
              tag="article"
              style="max-width: 20rem;"
              class="mb-2">
                <b-card-text>
                    {{ `Author: ${data.author}`}}  
                    <br/> 
                    {{`Category: ${data.category}`}}
                </b-card-text>
              <router-link :to="{ name: 'Blog', params: {id: data._id }, props: {blogdata:data._id}}" tag="button" class="btn btn-dark">View Content</router-link>
            </b-card>
          </b-col>
        </div>
      </b-row>
    </div>
    <div v-else>
      <h5>Loading Details...</h5>
    </div>
  </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Web3 from "web3";
import BlogBackend from "../../script/backend/blog";
import ContractDetails from "../static/ABI/blog";
import blogimg from "../static/images/blog3.jpg";
var web3;
var blogBackend;

export default {
  data() {
    return{
      blogPosts: [],
      blogPosts_actual: [],
      imgsrc: blogimg,
      search:""
    }
  },
   async mounted() {
   if (window.ethereum) {
      web3 = new Web3(ethereum);
      try {
        await ethereum.enable();
      } catch (error) {
        console.log("error while getting permission");
      }
    } else if (window.web3) {
      web3 = new Web3(web3.currentProvider);
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }

    blogBackend = new BlogBackend(ContractDetails.abi, ContractDetails.contractAddress, web3);
    var that = this;
    fetch("http://192.168.29.2:5000/posts")
    .then(response => response.json())
    .then(async function(result) {
        const verifiedResult = await blogBackend.addValidityTag(result);
        that.blogPosts_actual = verifiedResult;
        that.blogPosts = verifiedResult;
    });
  },
  watch: {
    search: function() {
      var that = this;
      this.blogPosts = this.blogPosts_actual.filter(function(blog) {
        if (
          blog.title
            .toLowerCase()
            .indexOf(that.search.toLowerCase()) != "-1") {
          return blog;
        }
      });
    }
  }
};
</script>
<template>
  <div class="Main">
    <div>
      <b-navbar toggleable sticky type="dark" variant="dark">
        <b-navbar-brand href="#">Add Blog</b-navbar-brand>

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
            <b-nav-item href="/profile">Profile</b-nav-item>
            <b-nav-item href="/about">Blog Posts</b-nav-item>
            <b-nav-item href="/">Sign Out</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <br/>
    <div>
      <h2>Add Blog Details</h2>
      <hr />
      <br />
      <b-container variant="dark">
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <b-form-group
            id="input-group-0"
            label="Author:"
            label-for="input-0"
            description="change in metamask"
          >
            <b-form-input id="input-0" type="email" required :placeholder="form.author" disabled></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-1"
            label="Title:"
            label-for="input-1"
            description="Pls keep the title very precise"
          >
            <b-form-input id="input-1" v-model="form.title" required placeholder="Enter title"></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="Category" label-for="input-2">
            <b-form-input
              id="input-2"
              v-model="form.category"
              required
              placeholder="Enter category"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-3" label="Tags:" label-for="input-3">
            <b-form-tags id="input-3" v-model="form.tags" required placeholder="Enter tags"></b-form-tags>
          </b-form-group>

          <b-form-group id="input-group-4" label="Blog Content:" label-for="input-4">
            <b-form-textarea
              id="input-4"
              v-model="form.content"
              placeholder="Enter your Blog content"
              rows="3"
              max-rows="6"
            ></b-form-textarea>
          </b-form-group>

          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
      </b-container>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
import BlogBackend from "../../script/backend/blog";
import ContractDetails from "../static/ABI/blog";
var web3;
var blogBackend;
export default {
  data() {
    return {
      web3: null,
      form: {
        author: ethereum.selectedAddress,
        title: "",
        category: "",
        tags: [],
        content: ""
      },
      show: true
    };
  },
  mounted: async function() {
    if (window.ethereum) {
      this.web3 = new Web3(ethereum);
      try {
        await ethereum.enable();
      } catch (error) {
        console.log("error while getting permission");
      }
    } else if (window.web3) {
      this.web3 = new Web3(web3.currentProvider);
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
    this.form.author = ethereum.selectedAddress;
    blogBackend = new BlogBackend(
      ContractDetails.abi,
      ContractDetails.contractAddress,
      (web3 = this.web3)
    );
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      var that = this;
      fetch("http://192.168.29.2:5000/posts", {
        method: "POST",
        body: JSON.stringify(this.form),
        headers: {
          "content-type": "application/json"
        }
      })
        .then(function(response) {
          return response.json();
        })
        .then(async function(data) {
          var changedData = JSON.parse(JSON.stringify(data));
          const _content = changedData.result.content;
          const _id = changedData.result._id;
          const fromAddress = changedData.result.author;
          const result = await blogBackend.addBlog(_content, _id, fromAddress);
          return result;
        })
        .then(function(result) {
          console.log(result);
        });
    },
    onReset(evt) {
      evt.preventDefault();
      // Reset our form values
      this.form.author = ethereum.selectedAddress;
      this.form.title = "";
      this.form.category = "";
      this.form.tags = [];
      this.form.content = "";
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    }
  }
};
</script>

<style scoped>
.form {
  padding-right: 10mm;
  padding-left: 10mm;
}
</style>
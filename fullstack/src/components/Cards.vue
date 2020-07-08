<template>
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
</template>

<script>
import Web3 from "web3";
import BlogBackend from "../../script/backend/blog";
import ContractDetails from "../static/ABI/blog";
import blogimg from "../static/blog1.png";
var web3;
var blogBackend;
export default {
  data() {
    return {
      blogPosts: [],
      imgsrc: blogimg
    };
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
        that.blogPosts = verifiedResult;
    });
  }
};
</script>
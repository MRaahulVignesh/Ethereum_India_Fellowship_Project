<template>
  <div>
    <div v-if="blogData">
      <b-container fluid>
        <b-jumbotron
          justify
          bg-variant="dark"
          text-variant="white"
          border-variant="dark"
          header-tag="h6"
        >
          <template v-slot:header>{{blogData.title}}</template>

          <template v-slot:lead>
            <span class="bg-secondary rounded">{{ ` Author: ${blogData.author} `}}</span> |
            <span class="bg-secondary rounded">{{` Category: ${blogData.category} `}}</span> |
            <span class="bg-secondary rounded">{{` Created: ${blogData.date }`}}</span>
          </template>
          <b-badge
            variant="success"
            pill
            tag="h6"
            v-if="blogData.verified == 'true' && subscribed"
          >Verified</b-badge>
          <b-badge
            variant="danger"
            pill
            tag="h6"
            v-else-if="blogData.verified == 'false' && subscribed"
          >Not Verified</b-badge>
        </b-jumbotron>

        <b-jumbotron v-if="subscribed">
          <p>{{blogData.content}}</p>
        </b-jumbotron>
        <b-jumbotron v-else>
          <b-row>
            <b-col><p>Please subscribe to view your content</p></b-col>
          </b-row>
          <b-row>
            <b-col><b-button variant="info" @click="onSubscribe">Subscribe</b-button></b-col>
          </b-row>
          <b-row v-show="showspinner">
            <b-col><b-spinner
            class="m-5"
            variant="info"
            style="width: 3rem; height: 3rem;"
            label="Large Spinner"
          ></b-spinner></b-col>
          </b-row>
          <b-row v-show="showspinner">
            <b-col><h6>Processing your request. Please Wait!</h6></b-col>
          </b-row>
        </b-jumbotron>
      </b-container>
    </div>

    <div v-else>
      <h5>Loading Details...</h5>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
import SubscriptionBackend from "../../script/backend/subscriptions";
import TokenBackend from "../../script/backend/token";
import BlogBackend from "../../script/backend/blog";
import blogContract from "../static/ABI/blog";
import masterContract from "../static/ABI/master";
var tokenBackend;
var blogBackend;
var subscriptionBackend;
var web3;

export default {
  data: function() {
    return {
      blogData: null,
      subscribed: false,
      showspinner: false,
    };
  },
  mounted: async function() {

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
      console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }

    blogBackend = new BlogBackend(blogContract.abi, blogContract.contractAddress, web3);
    subscriptionBackend = new SubscriptionBackend(masterContract.abi, masterContract.contractAddress, web3);
    tokenBackend = new TokenBackend(masterContract.abi, masterContract.contractAddress, web3);

    try{
        const result = await tokenBackend.tokenOfOwnerByIndex(ethereum.selectedAddress, 0);
        if(result)
            this.subscribed = true;
        else
            this.subcribed = false;
    }
    catch(err){
        this.subcribed = false;
    }

    var that = this;
    fetch("http://192.168.29.2:5000/posts/id/" + this.$route.params.id)
      .then(response => response.json())
      .then(async function(result){
        const verifiedResult = await blogBackend.addValidityTag(result);
        that.blogData = verifiedResult[0];
      });
  },
  methods: {
    onSubscribe: async function() {
      this.showspinner = true;

      try {
        const result = await subscriptionBackend.addSubscription(ethereum.selectedAddress);

        if (result) {
          console.log(result);
        } else {
          console.log(result);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.showspinner = false;
        window.location.reload();
      }
    }
  }
};
</script>

<style scoped>
.jumbotron2 {
  padding-top: 2mm;
  padding-bottom: 0mm;
}
</style>

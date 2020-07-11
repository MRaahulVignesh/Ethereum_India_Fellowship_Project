/* eslint-disable */
<template >
  <div class="fullscreen a">
    <div class="title-class">
      <b-img src="../static/images/logo.png"></b-img>
      <h6 class="title-tagline">- A Decentralized Publishing Platform</h6>
    </div>
    <div class="card-class">
      <b-container>
        <b-card
          class="mx-auto"
          bg-variant="dark"
          header="Features of the platform"
          header-tag="h4"
          text-variant="light"
          header-border-variant="light"
          style="max-width: 35rem;"
        >
          <b-card-text>> Subscriptions based on ERC-721 Token</b-card-text>

          <b-card-text>> Transfer your Subscriptions via Bhip Token</b-card-text>

          <b-card-text>> Verifiability Tags to guarantee authencity of the published contents</b-card-text>

          <b-card-text>> Pay only refundable fee to view premimum content</b-card-text>

          <b-card-text>> One Click Login using Metamask</b-card-text>
        </b-card>
      </b-container>
    </div>
    <div class="button-login">
      <b-button pill variant class="button-background" size="lg" @click="login">Login with Metamask</b-button>
    </div>
    <div class="title-tagline">
      <br/>
      <br/>
    <h6>Made with <span class="heart-color">&#10084;</span> by Raahul</h6>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
import LoginBackend from "../../script/backend/login";
import ContractDetails from "../static/ABI/master";

var web3;
export default {
  data: function() {
    return {
      loginStatus: null
    };
  },
  components: {},
  methods: {
    login: async function() {
      if (window.ethereum) {
        web3 = new Web3(ethereum);
        try {
          await ethereum.enable();
        } catch (error) {
          this.$bvToast.toast("Error while getting permission", {
            title: "Error",
            toaster: "b-toaster-top-right",
            variant: "danger",
            solid: true
          });
        }
      } else if (window.web3) {
        web3 = new Web3(web3.currentProvider);
      } else {
        this.$bvToast.toast(
          "Non-Ethereum browser detected. You should consider trying MetaMask!",
          {
            title: "Error",
            toaster: "b-toaster-top-right",
            variant: "danger",
            solid: true
          }
        );
      }
      var loginBackend = new LoginBackend(
        ContractDetails.abi,
        ContractDetails.contractAddress,
        web3
      );
      this.loginStatus = await loginBackend.oneClickLogin(
        ethereum.selectedAddress
      );
      if (this.loginStatus.resultCode == 0) {
        this.$router.push("BlogPosts");
      } else {
        this.$bvToast.toast("Error While Signing In", {
          title: "Error",
          toaster: "b-toaster-top-right",
          variant: "danger",
          solid: true
        });
      }
    }
  }
};
</script>

<style scoped>
.fullscreen {
  width: 100%;
  height: 100vh;
  padding-top: 2mm;
  background-color: black;
}
.a {
  background: url("../static/images/title1.jpg") center/cover;
}

.title-text {
  color: white;
}
.title-tagline {
  color: white;
}

.button-login {
  padding-top: 20mm;
}

.feature-text {
  color: white;
  padding-top: 50mm;
}

.card-class {
  padding-top: 25mm;
}

.button-background {
  background-color: coral;
}

.heart-color {
  color: red;
}
</style>

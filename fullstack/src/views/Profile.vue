<template>
  <div class="Main">
    <div>
      <b-navbar toggleable sticky type="dark" variant="dark">
        <b-navbar-brand href="#">Profile</b-navbar-brand>

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
    <br />
    <b-container>
      <b-row>
        <b-col></b-col>
        <b-col>
          <b-avatar size="6rem"></b-avatar>
        </b-col>
        <b-col></b-col>
      </b-row>
      <br />
      <div>
        <b-form>
          <b-form-group id="input-group-1" label="Public Key or Profile Id:" label-for="input-1">
            <b-form-input
              id="input-1"
              required
              disabled
              class="text-center"
              :placeholder="profileId"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="Subscription Id:" label-for="input-2">
            <b-form-input
              id="input-2"
              required
              :placeholder="subscriptionId == 'false' ? 'Not available' : subscriptionId"
              disabled
              class="text-center"
            ></b-form-input>
          </b-form-group>
          <b-form-group id="input-group-3" label="Redeem Time:" label-for="input-3">
            <b-form-input
              id="input-3"
              required
              disabled
              :placeholder="redeemTime.toString()"
              class="text-center"
            ></b-form-input>
          </b-form-group>
        </b-form>
      </div>
      <b-jumbotron v-if="subscriptionId == 'false' || subscriptionId == '' ">
        <b-row>
          <b-col>
            <p>You are one click away from your subscription!</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-button variant="info" @click="onSubscribe">Subscribe</b-button>
          </b-col>
        </b-row>
        <b-row v-show="showspinner">
          <b-col>
            <b-spinner
              class="m-5"
              variant="info"
              style="width: 3rem; height: 3rem;"
              label="Large Spinner"
            ></b-spinner>
          </b-col>
        </b-row>
        <b-row v-show="showspinner">
          <b-col>
            <h6>Processing your request. Please Wait!</h6>
          </b-col>
        </b-row>
      </b-jumbotron>
      <b-jumbotron v-else>
        <b-row class="mt-0">
          <b-col></b-col>
          <b-col>
            <h3>Manage subscription</h3>
            <hr />
          </b-col>
          <b-col></b-col>
        </b-row>
        <br />
        <b-row>
          <b-col></b-col>
          <b-col>
            <b-button size="lg" variant="danger" @click="onRevoke">Revoke Subscription</b-button>
          </b-col>
          <b-col></b-col>
        </b-row>
        <b-row v-show="revokespinner">
          <b-col></b-col>
          <b-col>
            <b-spinner
              class="m-5"
              variant="info"
              style="width: 3rem; height: 3rem;"
              label="Large Spinner"
            ></b-spinner>
          </b-col>
          <b-col></b-col>
        </b-row>
        <b-row v-show="revokespinner">
          <b-col></b-col>
          <b-col>
            <p>Processing Transaction...</p>
          </b-col>
          <b-col></b-col>
        </b-row>
        <br />
        <hr />
        <h4 class="mx-auto">Transfer Subscription</h4>
        <br />
        <b-form inline>
          <b-form-group
            class="mx-auto"
            id="input-group-4"
            label="Receiver's Address:"
            label-for="input-4"
          >
            <b-form-input
              id="input-4"
              required
              class="text-center mr-sm-2"
              placeholder="Receiver Profile Id"
              v-model="toAddress"
              description="profile id refers to public key"
            ></b-form-input>
          </b-form-group>
        </b-form>
        <br />
        <b-button variant="success" @click="onTransfer">Transfer</b-button>
        <b-row v-show="transferspinner">
          <b-col></b-col>
          <b-col>
            <b-spinner
              class="m-5"
              variant="info"
              style="width: 3rem; height: 3rem;"
              label="Large Spinner"
            ></b-spinner>
          </b-col>
          <b-col></b-col>
        </b-row>
        <b-row v-show="transferspinner">
          <b-col></b-col>
          <b-col>
            <p>Processing Transaction...</p>
          </b-col>
          <b-col></b-col>
        </b-row>
      </b-jumbotron>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import navbar from "@/components/Navbar.vue";
import Web3 from "web3";
import TokenBackend from "../../script/backend/token";
import ContractDetails from "../static/ABI/master";
import SubscriptionBackend from "../../script/backend/subscriptions";
var subcriptionBackend;
var tokenBackend;
var web3;
export default {
  data: function() {
    return {
      profileId: "",
      subscriptionId: "",
      redeemTime: 0,
      showspinner: false,
      revokespinner: false,
      transferspinner: false,
      toAddress: ""
    };
  },
  components: {
    navbar
  },
  async created() {
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
    this.profileId = ethereum.selectedAddress;
    tokenBackend = new TokenBackend(
      ContractDetails.abi,
      ContractDetails.contractAddress,
      web3
    );
    this.subscriptionId = (
      await tokenBackend.tokenOfOwnerByIndex(ethereum.selectedAddress, 0)
    ).toString();
    subcriptionBackend = new SubscriptionBackend(
      ContractDetails.abi,
      ContractDetails.contractAddress,
      web3
    );
    this.redeemTime = await subcriptionBackend.getRedeemTime(
      ethereum.selectedAddress
    );
    if(this.redeemTime != 0){
      const unixTimestamp = this.redeemTime;
      const milliseconds = unixTimestamp * 1000; 
      const dateObject = new Date(milliseconds);
      this.redeemTime = dateObject.toLocaleString();
    }
  },
  methods: {
    onSubscribe: async function() {
      this.showspinner = true;
      console.log(web3);
      try {
        const result = await subcriptionBackend.addSubscription(
          ethereum.selectedAddress
        );
        if (result) {
          console.log(result);
        } else {
          console.log(result);
          // res.status(404).json({resultCode: 2, message: "adding subscription failed"});
        }
      } catch (error) {
        console.log(error);
        // res.status(404).json({resultCode: 1, message: "adding subscription failed"});
      } finally {
        this.showspinner = false;
        window.location.reload();
      }
    },
    onRevoke: async function() {
      this.revokespinner = true;
      try {
        const result = await subcriptionBackend.redeemSubscription(
          ethereum.selectedAddress
        );
        if (result) {
          console.log("revoked subscription");
        } else {
          console.log(result);
          // res.status(404).json({resultCode: 2, message: "adding subscription failed"});
        }
      } catch (error) {
        console.log(error);
        // res.status(404).json({resultCode: 1, message: "adding subscription failed"});
      } finally {
        this.revokespinner = false;
        window.location.reload();
      }
    },
    onTransfer: async function() {
      this.transferspinner = true;
      try {
        const result = await tokenBackend.transfer(ethereum.selectedAddress, this.toAddress, parseInt(this.subscriptionId));
        if (result) {
          console.log("subscription transfered");
        } else {
          console.log(result);
          // res.status(404).json({resultCode: 2, message: "adding subscription failed"});
        }
      } catch (error) {
        console.log(error);
        // res.status(404).json({resultCode: 1, message: "adding subscription failed"});
      } finally {
        this.transferspinner = false;
        window.location.reload();
      }
    }
  }
};
</script>
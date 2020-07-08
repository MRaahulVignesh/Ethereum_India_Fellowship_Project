const Master = artifacts.require("Master");

module.exports = function(deployer) {
  deployer.deploy(Master);
};
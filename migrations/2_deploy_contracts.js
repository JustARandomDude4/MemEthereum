// puts smartcontracts in block chain
//move smart contracts from one place to another
// compiles them down so that they can be run and executed

const MemEthereum = artifacts.require("MemEthereum");

module.exports = function(deployer) {

  deployer.deploy(MemEthereum);   //this deploys the memEthereumproject to smart chain
};
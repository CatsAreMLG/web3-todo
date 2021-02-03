import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';

class App extends Component {

  constructor(props){
    super(props)
    this.state= {
      account: ''
    }
  }

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    const network = await web3.eth.net.getNetworkType()
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
  }

  render (){
    return <div className="container">
      <h1>Hello, World!</h1>
      <p>Your account: {this.state.account}</p>
    </div>
  }
}

export default App;

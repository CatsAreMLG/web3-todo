import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import todoList from './backend/build/contracts/TodoList.json'

const TODO_LIST_ABI = todoList.abi
const TODO_LIST_ADDRESS = Object.values(todoList.networks)[0].address

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
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545")
    const accounts = await web3.eth.requestAccounts()
    this.setState({account: accounts[0]})
    const todoList = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS)
    this.setState({todoList})
    console.log(todoList)
  }

  render (){
    return <div className="container">
      <h1>Hello, World!</h1>
      <p>Your account: {this.state.account}</p>
    </div>
  }
}

export default App;

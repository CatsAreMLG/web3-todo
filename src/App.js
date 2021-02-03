import React, { Component } from 'react';
import Web3 from 'web3'

import TodoList from './components/TodoList/TodoList'

import './App.css';
import todoList from './backend/build/contracts/TodoList.json'

const TODO_LIST_ABI = todoList.abi
const TODO_LIST_ADDRESS = Object.values(todoList.networks)[0].address

class App extends Component {
  state= {
    account: '',
    tasks: [],
    taskCount: 0,
    loading: true
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
    const taskCount = await todoList.methods.taskCount().call()
    this.setState({taskCount})
    for (var i = 0; i < taskCount; i++) {
      const task = await todoList.methods.tasks(i).call()
      this.setState({
        tasks: [...this.state.tasks, task]
      })
    }
    this.setState({ loading: false })
  }

  createTask = content => {
    this.setState({ loading: true })
    this.state.todoList.methods.createTask(content)
      .send({from:this.state.account})
      .once('receipt', (receipt) => {
        this.setState({
          tasks: [],
          taskCount: 0,
          loading: false
        })
        this.loadBlockchainData()
      })
  }

  toggleCompleted = taskId => {
    this.setState({ loading: true })
    this.state.todoList.methods.toggleCompleted(taskId)
      .send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({
          tasks: [],
          taskCount: 0,
          loading: false
        })
        this.loadBlockchainData()
      })
  }

  render (){
    return (
      <>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <span className="navbar-brand col-sm-3 col-md-2 mr-0">Dapp Todo List</span>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small><span id="account"></span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex justify-content-center">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <TodoList
                  tasks={this.state.tasks}
                  createTask={this.createTask}
                  toggleCompleted={this.toggleCompleted} />
              }
            </main>
          </div>
        </div>
      </>
    )
  }
}

export default App;

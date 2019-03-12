import React, { Component } from 'react';
import './Home.css'
import axios from 'axios'
import { Redirect } from 'react-router-dom';

export class Home extends Component {
    displayName = Home.name

    constructor(props) {
        super(props)
        this.state = {
            usernames: [],
            name: "",
            logout: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.setLogout = this.setLogout.bind(this)
    }
    loadList() {
        axios.get('https://localhost:5001/api/users', {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
            .then(response => {
                const usernames = response.data.map(obj => ({ id: obj.id, name: obj.name }));
                this.setState({ usernames });
            }
        )
    }
    componentDidMount() {
        this.loadList();
    }
    handleChange(e) {
        this.setState({name: e.target.value});
    }
    handleSubmit(e) {
        e.preventDefault();

        let headerConfig = {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwtToken')}`
            }
        }

        axios.post('https://localhost:5001/api/users', { name: this.state.name }, headerConfig)
            .then(response => {
                console.log(response);
                console.log(response.data);
                this.loadList();
            }) 
    }

    setLogout() {
        this.setState({
            logout: true
        });
    }
    renderLogout() {
        if (this.state.logout) {
            localStorage.clear();
            return <Redirect to='/' />
        }
    }

    render() {
        if (localStorage.getItem('jwtToken') == null) {
            return (
                <Redirect to='/' />
            );
        }
        return (
            <div>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Person Name:
                            <input type="text" name="name" onChange={this.handleChange} />
                        </label>
                        <button type="submit">Add</button>
                    </form>
                </div>
                {this.renderLogout()}
                <button onClick={this.setLogout}>Log out</button>
                <ul>
                    {this.state.usernames.map(function (user) {
                        return (
                            <div key={user.id} >
                                <p>{user.name}</p>
                            </div>
                        )
                    }
                    )}
                </ul>
                
            </div>
        );
    }
}

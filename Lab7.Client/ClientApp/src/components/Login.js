import React, { Component } from 'react';
import axios from 'axios'
import { Redirect } from 'react-router-dom';


export class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: "",
            redirect: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e) {
        this.setState({ name: e.target.value });
    }
    handleSubmit(e) {
        e.preventDefault();

        axios.post('https://localhost:5001/api/users/token', { name: this.state.name })
            .then(response => {
                if (response.data != null) {
                    localStorage.setItem('jwtToken', response.data);
                    this.setState({ redirect: true });
                }
            })
    }
    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/Home' />
        }
    }
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Your login:
                            <input type="text" name="name" onChange={this.handleChange} />
                    </label>
                    <button type="submit">Enter</button>
                    {this.renderRedirect()}
                </form>
            </div>
            );
    }
}
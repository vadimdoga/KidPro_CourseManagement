import React, { Component } from "react";
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react'

export default class SignIn extends Component {
    constructor(props) {
        super(props)

        this.setClientRole = this.setClientRole.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.state = {
            role: "",
            email: "",
            password: ""
        }
    }
    setClientRole(e) {
        e.preventDefault()

        const role = e.target.value
        this.setState({
            role: role
        })
    }
    handleSubmit(e) {
        e.preventDefault()

        this.props.history.push("/main");
        console.log("Successful Login")
    }
    render() {
        return (
            <div>
                <Grid
                    textAlign="center"
                    style={{ height: "100vh" }}
                    verticalAlign="middle">
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as="h2" color="teal" textAlign="center">
                            Welcome to Course Management
                            <br />
                            Log-in to your account
                        </Header>

                        <Form size="large">
                            <Segment stacked>
                                <Segment style={this.state.role ? { display: 'none' } : {}}>
                                    <h4>As whom do you position yourself?</h4>
                                    <Button color="blue" value="Teacher" onClick={this.setClientRole}>Teacher</Button>
                                    <Button color="teal" value="Manager" onClick={this.setClientRole}>Manager</Button>
                                </Segment>

                                <div style={this.state.role ? {} : { display: 'none' }}>
                                    <Form.Input
                                        fluid
                                        icon="user"
                                        iconPosition="left"
                                        placeholder="E-mail address"
                                        value={this.state.email}
                                        onChange={e => this.setState({email: e.target.value})}
                                    />
                                    <Form.Input
                                        fluid
                                        icon="lock"
                                        iconPosition="left"
                                        placeholder="Password"
                                        type="password"
                                        value={this.state.password}
                                        onChange={e => this.setState({password: e.target.value})}
                                    />

                                    <Button type="submit" onClick={this.handleSubmit} color="teal" fluid size="large">
                                        Login
                                    </Button>
                                </div>
                            </Segment>
                        </Form>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

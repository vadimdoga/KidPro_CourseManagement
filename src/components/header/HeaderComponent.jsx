import React, { Component } from 'react'
import "./HeaderComponent.css"
import Logo from "../../assets/logo.png"
import { Container, Menu, Button, Image } from "semantic-ui-react"


export default class HeaderComponent extends Component {
    constructor(props) {
        super(props)

        this.handleCreateCourseClick = this.handleCreateCourseClick.bind(this)
        this.handleLogoClick = this.handleLogoClick.bind(this)
    }
    handleCreateCourseClick(e) {
        this.props.history.push("/courses/new")
    }
    handleLogoClick(e) {
        this.props.history.push("/courses")
    }
    render() {
        return (
            <Menu id="header_menu" fixed="top" inverted>
                <Container>
                    <Menu.Item onClick={this.handleLogoClick} id="no_border" as="a" header>
                        <Image
                            size="tiny"
                            src={Logo}
                            style={{ marginRight: "1.5em" }}
                        />
                    Kid Pro
                </Menu.Item>
                    <Menu.Item position="right" id="no_border">
                        <Button onClick={this.handleCreateCourseClick}>Create Course</Button>
                    </Menu.Item>
                </Container>
            </Menu>
        )
    }
}

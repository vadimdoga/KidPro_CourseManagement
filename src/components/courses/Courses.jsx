import React, { Component } from 'react'
import { Container, Menu, Segment, Header, Button } from "semantic-ui-react"
import CourseDetails from "./course_details/CourseDetails"

const header_bar_style = {
    backgroundColor: "#00b5ad",
    width: "50%",
    margin: "auto",
    padding: "5px 5px"
}

const header_name_style = {
    margin: "auto",
    fontWeight: "bold",
    color: "white",
    fontSize: "large"
}

const segment_style = {
    borderRadius: "25px",
    margin: "auto",
    width: "50%",
}

const divider_style = {
    width: "50%",
    margin: "30px auto"
}


export default class Courses extends Component {
    render() {
        return (
            <div>
                <Header>
                    <Menu borderless style={header_bar_style}>
                        <Container>
                            <Menu.Item>
                                LOGO
                            </Menu.Item>
                            <Menu.Item>
                                <Button>Create Course</Button>
                            </Menu.Item>
                            <Menu.Item style={header_name_style}>
                                Course Management
                            </Menu.Item>
                        </Container>
                    </Menu>
                </Header >

                <h4 style={divider_style} class="ui horizontal divider header">
                    <i class="book icon"></i>
                    My Courses
                </h4>

                <Segment style={segment_style}>
                    <CourseDetails courseName="Learning keyboard" courseID="1" role="Teacher" />
                    <CourseDetails courseName="Learning Maths" courseID="2" role="Teacher" />
                    <CourseDetails courseName="Learning English" courseID="3" role="Teacher" />
                    <CourseDetails courseName="Learning Science" courseID="4" role="Teacher" />
                </Segment>
            </div >
        )
    }
}

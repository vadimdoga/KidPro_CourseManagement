import React, { Component } from 'react'
import { Segment } from "semantic-ui-react"
import CourseDetails from "./CourseDetails"
import HeaderComponent from "../../header/HeaderComponent"


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
                <HeaderComponent history={this.props.history} />

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

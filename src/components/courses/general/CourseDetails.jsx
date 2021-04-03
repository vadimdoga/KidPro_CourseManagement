import React, { Component } from 'react'
import { Segment, Button, ButtonGroup, Icon } from "semantic-ui-react"

const style_segment = {
    height: "60px"
}

const style_header = {
    fontWeight: "bold",
    float: "left",
    padding: "5px",
    marginRight: "20%",
}

const style_buttons = {
    float: "right",

}

export default class CourseDetails extends Component {
    render() {
        return (
            <Segment style={style_segment}>
                <span style={style_header}>{this.props.courseName}</span>
                <ButtonGroup style={style_buttons}>
                    <Button>Edit</Button>
                    <Button style={this.props.role === "Teacher" ? {display: "none"} : {}}>Publish</Button>
                    <Button icon>
                        <Icon color="red" name="remove circle"></Icon>
                    </Button>
                </ButtonGroup>
            </Segment>
        )
    }
}

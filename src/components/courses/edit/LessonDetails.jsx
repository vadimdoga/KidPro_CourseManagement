import React, { Component } from 'react'
import { Button, Form, Input, Segment, Select, TextArea } from 'semantic-ui-react'


const segment_style = {
    borderRadius: "25px",
    margin: "auto",
    width: "50%",
    marginBottom: "2rem"
}

export default class LessonDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            lessonName: "",
            lessonDescription: ""
        }

    }
    render() {
        return (
            <div>
                <Segment style={segment_style} color="red" size="small">
                    <Form>
                        <Form.Field
                            id="form-input-control-lesson-name"
                            control={Input}
                            label='Lesson name'
                            placeholder='Division and Multiplication'
                            width={12}
                            value={this.state.lessonName}
                            onChange={e => this.setState({ lessonName: e.target.value })}
                        />

                        <Form.Field
                            id='form-textarea-control-lesson-description'
                            control={TextArea}
                            label='Description'
                            placeholder='Lesson description'
                            value={this.state.lessonDescription}
                            onChange={e => this.setState({ lessonDescription: e.target.value })}
                        />
                    </Form>
                </Segment>
            </div>
        )
    }
}

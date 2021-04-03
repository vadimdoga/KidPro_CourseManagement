import React, { Component } from 'react'
import { Form, Input, Segment, Select, TextArea } from 'semantic-ui-react'
import HeaderComponent from "../../header/HeaderComponent"

const gradeOptions = [
    { key: 'grade_1', text: 'Grade I', value: 'grade_1' },
    { key: 'grade_2', text: 'Grade II', value: 'grade_2' },
    { key: 'grade_3', text: 'Grade III', value: 'grade_3' },
    { key: 'grade_4', text: 'Grade IV', value: 'grade_4' },
]

const segment_style = {
    borderRadius: "25px",
    margin: "auto",
    width: "50%",
}

export default class NewCourse extends Component {
    constructor(props) {
        super(props)

        this.handleSubmitExit = this.handleSubmitExit.bind(this)
        this.handleSubmitContinue = this.handleSubmitContinue.bind(this)

        this.state = {
            courseName: "",
            courseDescription: "",
            gradeOption: ""
        }
    }
    handleSubmitExit(e) {
        e.preventDefault()

        this.props.history.push("/courses");
    }
    handleSubmitContinue(e) {
        e.preventDefault()

        this.props.history.push("/courses/edit/id");
    }
    render() {
        return (
            <div>
                <HeaderComponent history={this.props.history} />

                <Segment style={segment_style} color="teal" size="small">
                    <Form>
                        <Form.Group>
                            <Form.Field
                                id="form-input-control-course-name"
                                control={Input}
                                label='Course name'
                                placeholder='Mathematics'
                                width={12}
                                value={this.state.courseName}
                                onChange={e => this.setState({courseName: e.target.value})}
                            />
                            <Form.Field
                                control={Select}
                                options={gradeOptions}
                                label={{ children: 'Grades', htmlFor: 'form-select-control-grades' }}
                                placeholder='Grades'
                                search
                                searchInput={{ id: 'form-select-control-grades' }}
                                value={this.state.gradeOption}
                                onChange={e => this.setState({gradeOption: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Field
                            id='form-textarea-control-course-description'
                            control={TextArea}
                            label='Description'
                            placeholder='Course description'
                            value={this.state.courseDescription}
                            onChange={e => this.setState({courseDescription: e.target.value})}
                        />
                        <Form.Group>
                            <Form.Button onClick={this.handleSubmitExit} content='Save course & exit' />
                            <Form.Button onClick={this.handleSubmitContinue} content='Save course & continue' />
                        </Form.Group>
                    </Form>
                </Segment>
            </div>
        )
    }
}

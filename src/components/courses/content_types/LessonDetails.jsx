import React, { Component } from 'react'
import { Button, Form, Input, Accordion, Dropdown, TextArea } from 'semantic-ui-react'
import ExpandDetails from "../../course_components/ExpandDetails"



const accordion_style = {
    marginTop: "1rem",
    textAlign: "left"
}

const btn_style = {
    marginTop: "0.5rem"
}

const btn_right_style = {
    marginTop: "0.5rem",
    marginRight: "1rem"
}

const contentOptions = [
    { key: 1, text: 'Lecture', value: "lecture" },
    { key: 2, text: 'Exercise', value: "exercise" }
]


export default class LessonDetails extends Component {
    constructor(props) {
        super(props)

        this.handleAddContent = this.handleAddContent.bind(this)
        this.createExpandable = this.createExpandable.bind(this)

        this.state = {
            lessonName: "",
            lessonDescription: "",
            contentType: "",
            components: {
                children: {},
                length: 0,
            }
        }

    }

    handleAddContent(e) {
        const length = this.state.components.length + 1
        const new_key = "key_" + length

        let children = this.state.components["children"]

        if (this.state.contentType === "exercise") {
            children[new_key] = <ExpandDetails key="division" title={this.state.lessonName}>This is an exercise</ExpandDetails>

        } else if (this.state.contentType === "lecture") {
            children[new_key] = <ExpandDetails key="division" title={this.state.lessonName}>This is a lecture</ExpandDetails>
        }

        this.setState({
            components: {
                length: length,
                children: children
            },
            contentType: ""
        })
    }

    createExpandable([key, value]) {
        const id = "expandable-list-" + key
        console.log(id)
        return <div key={id} id={id}>
            <Button style={btn_right_style} onClick={this.handleRemove} value={key} floated="right" color="red" icon="remove circle" size="mini" />
            <Button style={btn_style} onClick={this.handleMoveDown} value={id} floated="right" color="blue" icon="arrow circle down" size="mini" />
            <Button style={btn_style} onClick={this.handleMoveUp} value={id} floated="right" color="blue" icon="arrow circle up" size="mini" />
            {value}
        </div>
    }

    render() {
        return (
            <div>
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
                <br />
                <Dropdown placeholder="Choose content type" clearable options={contentOptions} selection onChange={e => this.setState({ contentType: e.target.value })} value={this.state.contentType} />
                <Button onClick={this.handleAddContent} style={{ marginLeft: "1rem" }} circular size="small" color="teal" icon='plus circle' />

                <Accordion style={accordion_style} fluid styled>
                    {
                        Object.entries(this.state.components["children"]).map(this.createExpandable)
                    }
                </Accordion>
            </div>
        )
    }
}

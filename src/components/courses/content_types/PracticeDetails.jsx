import React, { Component } from 'react'
import { Form, Input, TextArea, Button, Segment } from 'semantic-ui-react'
import { v4 as uuid } from "uuid"

import ExerciseModal from "./ExerciseModal"

const exercises_style = {
    width: "50%",
    margin: "1rem auto"
}

export default class PracticeDetails extends Component {
    constructor(props) {
        super(props)

        this.handleAddContent = this.handleAddContent.bind(this)
        this.createExpandable = this.createExpandable.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleMoveUp = this.handleMoveUp.bind(this)
        this.handleMoveDown = this.handleMoveDown.bind(this)
        this.handleLoadModal = this.handleLoadModal.bind(this)

        this.state = {
            practiceName: this.props.title,
            practiceDescription: "",
            components: {}
        }
    }

    componentDidMount() {
        const uuidKey = uuid()
        let children = this.state.components

        children[uuidKey] = {
            "html": <span>test</span>,
            "json": {
                contentQuestion: "test",
                contentAnswers: {"key": {"answer": "hey", "is_valid": true}},
                speech_2_text: false,
                image_blob: undefined
            }
        }

        this.setState({
            components: children
        })
    }

    handleRemove(e) {
        const key = e.currentTarget.value

        if (key !== undefined) {
            const children = this.state.components
            delete children[key]

            this.setState({
                components: children
            })
        }
    }

    handleMoveUp(e) {
        const element = document.querySelector("#" + e.currentTarget.value)

        if (element !== undefined)
            if (element.previousElementSibling)
                element.parentNode.insertBefore(element, element.previousElementSibling);
    }

    handleMoveDown(e) {
        const element = document.querySelector("#" + e.currentTarget.value)

        if (element !== undefined)
            if (element.nextElementSibling)
                element.parentNode.insertBefore(element.nextElementSibling, element);
    }

    handleAddContent(e, exerciseDetails) {
        console.log(exerciseDetails)
        const uuidKey = uuid()
        let components = this.state.components

        components[uuidKey] = {
            "html": <span>{ exerciseDetails["contentQuestion"] }</span>,
            "json": exerciseDetails
        }

        this.setState({
            components: components,
            contentName: ""
        })
    }

    createExpandable([key, value]) {
        const id = "expandable-list-" + uuid()
        return <Segment style={{ padding: "1rem" }} key={id} id={id}>
            <Button onClick={this.handleRemove} value={key} floated="right" color="red" icon="remove circle" size="mini" />
            <Button onClick={this.handleMoveDown} value={id} floated="right" color="green" icon="arrow circle down" size="mini" />
            <Button onClick={this.handleMoveUp} value={id} floated="right" color="green" icon="arrow circle up" size="mini" />
            {value["html"]}
        </Segment>
    }

    render() {
        return (
            <div>
                <Form>
                    <Form.Field
                        id="form-input-control-practice-name"
                        control={Input}
                        label='Practice name'
                        placeholder='Multiplication with 2'
                        width={12}
                        value={this.state.practiceName}
                        onChange={e => this.setState({ practiceName: e.target.value })}
                    />

                    <Form.Field
                        id='form-textarea-control-practice-description'
                        control={TextArea}
                        label='Description'
                        placeholder='Practice description'
                        value={this.state.practiceDescription}
                        selection
                        onChange={e => this.setState({ practiceDescription: e.target.value })}
                    />
                </Form>
                <br />
                <span style={{ fontWeight: "bold", margin: "1rem" }}>Add Exercise</span>
                <ExerciseModal practiceHandleSave={this.handleAddContent} />

                <Segment.Group style={exercises_style}>
                    {
                        Object.entries(this.state.components).map(this.createExpandable)
                    }
                </Segment.Group>
            </div>
        )
    }
}

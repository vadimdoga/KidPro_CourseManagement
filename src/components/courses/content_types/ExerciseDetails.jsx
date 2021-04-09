import React, { Component } from 'react'
import { Form, Input, TextArea, Button, Segment } from 'semantic-ui-react'
import { v4 as uuid } from "uuid"


export default class ExerciseDetails extends Component {
    constructor(props) {
        super(props)

        this.handleAddContent = this.handleAddContent.bind(this)
        this.createExpandable = this.createExpandable.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleMoveUp = this.handleMoveUp.bind(this)
        this.handleMoveDown = this.handleMoveDown.bind(this)

        this.state = {
            exerciseName: this.props.title,
            exerciseDescription: "",
            components: {}
        }
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

    handleAddContent(e) {
        console.log(this.state.contentType)
        const uuidKey = uuid()
        let children = this.state.components

        children[uuidKey] = <span>i am exercise</span>

        this.setState({
            components: children,
            contentName: ""
        })
    }

    createExpandable([key, value]) {
        const id = "expandable-list-" + uuid()
        return <Segment key={id} id={id}>
            <Button onClick={this.handleRemove} value={key} floated="right" color="red" icon="remove circle" size="mini" />
            <Button onClick={this.handleMoveDown} value={id} floated="right" color="green" icon="arrow circle down" size="mini" />
            <Button onClick={this.handleMoveUp} value={id} floated="right" color="green" icon="arrow circle up" size="mini" />
            {value}
        </Segment>
    }

    render() {
        return (
            <div>
                <Form>
                    <Form.Field
                        id="form-input-control-exercise-name"
                        control={Input}
                        label='Exercise name'
                        placeholder='Multiplication with 2'
                        width={12}
                        value={this.state.exerciseName}
                        onChange={e => this.setState({ exerciseName: e.target.value })}
                    />

                    <Form.Field
                        id='form-textarea-control-exercise-description'
                        control={TextArea}
                        label='Description'
                        placeholder='Exercise description'
                        value={this.state.exerciseDescription}
                        selection
                        onChange={e => this.setState({ exerciseDescription: e.target.value })}
                    />
                </Form>
                <br />
                <span style={{ fontWeight: "bold", margin: "1rem" }}>Add Exercise</span>
                <Button circular size="small" color="green" icon='plus circle' onClick={this.handleAddContent} />
                <Segment.Group>
                    {
                        Object.entries(this.state.components).map(this.createExpandable)
                    }
                </Segment.Group>
            </div>
        )
    }
}

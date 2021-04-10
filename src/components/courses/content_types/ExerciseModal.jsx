import React, { Component } from 'react'
import { Form, Button, Segment, Checkbox} from 'semantic-ui-react'
import ModalDetails from "../../course_components/ModalDetails"

import { v4 as uuid } from "uuid"


const exercises_style = {
    width: "50%",
    margin: "1rem auto"
}

export default class ExerciseModal extends Component {
    fileInputRef = React.createRef();

    constructor(props) {
        super(props)

        this.createExercises = this.createExercises.bind(this)
        this.makeExerciseValid = this.makeExerciseValid.bind(this)
        this.handleRemoveExercise = this.handleRemoveExercise.bind(this)
        this.handleMoveUp = this.handleMoveUp.bind(this)
        this.handleMoveDown = this.handleMoveDown.bind(this)
        this.fileChange = this.fileChange.bind(this)
        this.handleAddExercise = this.handleAddExercise.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)

        this.state = {
            contentQuestion: "",
            contentAnswers: {},
            contentAnswer: "",
            speech_2_text: false,
            image_blob: undefined
        }
    }

    handleModalClose(e) {
        this.setState({
            contentQuestion: "",
            contentAnswers: {},
            contentAnswer: "",
            speech_2_text: false,
            image_blob: undefined
        })
    }

    handleRemoveExercise(e) {
        const key = e.currentTarget.value

        if (key !== undefined) {
            const children = this.state.contentAnswers
            delete children[key]

            this.setState({
                contentAnswers: children
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

    makeExerciseValid(e) {
        const key = e.currentTarget.getAttribute('json_key')
        const contentAnswers = this.state.contentAnswers

        contentAnswers[key]["is_valid"] = !contentAnswers[key]["is_valid"]

        this.setState({
            contentAnswers: contentAnswers
        })

    }

    fileChange = (e) => {
        this.setState({ image_blob: e.target.files[0] }, () => {
            console.log("File chosen --->", this.state.image_blob);
        })
    }

    createExercises([key, answer_json]) {
        const id = "exercise-list-" + uuid()
        const is_valid = answer_json["is_valid"]
        const value = answer_json["answer"]

        return <Segment onClick={this.makeExerciseValid} json_key={key} style={{ padding: "1rem" }} key={id} id={id}>
            <Button onClick={this.handleRemoveExercise} value={key} floated="right" color="red" icon="remove circle" size="mini" />
            <Button onClick={this.handleMoveDown} value={id} floated="right" color="green" icon="arrow circle down" size="mini" />
            <Button onClick={this.handleMoveUp} value={id} floated="right" color="green" icon="arrow circle up" size="mini" />
            <span style={{cursor: "pointer"}}>{is_valid ? <b>{value}</b> : value}</span>
        </Segment>
    }

    handleAddExercise(e) {
        const contentAnswers = this.state.contentAnswers
        const key = uuid()

        const newAnswer = {
            "answer": this.state.contentAnswer,
            "is_valid": false
        }

        contentAnswers[key] = newAnswer

        this.setState({
            contentAnswers: contentAnswers,
            contentAnswer: ""
        })
    }

    render() {
        return (
            <ModalDetails
                btnColor="green"
                onClickFnc={this.handleAddContent}
                handleClose={this.handleModalClose}
            >
                <Form>
                    <Form.Input
                        fluid
                        onChange={e => this.setState({ contentQuestion: e.target.value })}
                        value={this.state.contentQuestion}
                        label="Provide a question" />
                    <Form.Field>
                        <Button
                            content="Choose File"
                            labelPosition="left"
                            icon="file"
                            onClick={() => this.fileInputRef.current.click()}
                        />
                        <input
                            ref={this.fileInputRef}
                            type="file"
                            hidden
                            onChange={this.fileChange}
                        />
                    </Form.Field>
                    <Form.Group>
                        <Form.Input
                            fluid
                            onChange={e => this.setState({ contentAnswer: e.target.value })}
                            value={this.state.contentAnswer}
                            width={10}
                            label="Provide an answer" />
                        <Button onClick={this.handleAddExercise} style={{ height: "50%", marginTop: "1.6rem" }} color="blue" icon="plus" width={3} />
                    </Form.Group>
                    <Segment.Group style={exercises_style}>
                        {
                            Object.entries(this.state.contentAnswers).map(this.createExercises)
                        }
                    </Segment.Group>

                    <Form.Field
                        control={Checkbox}
                        label={<label>Use speech to text feature?</label>}
                    />
                </Form>
            </ModalDetails>
        )
    }
}

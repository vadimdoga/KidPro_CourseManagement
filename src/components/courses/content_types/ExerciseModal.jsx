import React, { Component } from 'react'
import { Form, Button, Segment, Checkbox, Modal } from 'semantic-ui-react'
import { v4 as uuid } from "uuid"

//redux
import { connect } from "react-redux"
import { modifyQaComponents } from "../../../redux/actions/contentActions"
import { modifyModalState } from "../../../redux/actions/modalActions"

const exercises_style = {
    width: "50%",
    margin: "1rem auto"
}

class ExerciseModal extends Component {
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
        this.handleSave = this.handleSave.bind(this)

        this.state = {
            contentQuestion: "",
            contentAnswer: "",
            contentAnswers: {},
            speech_2_text: false,
            image_blob: undefined,

            qaComponents: this.props.qaComponents[this.props.modalID]
        }

        console.log(this.props.modalID)
    }

    handleModalClose(e) {
        this.setState({
            contentQuestion: "",
            contentAnswer: "",
            contentAnswers: {},
            speech_2_text: false,
            image_blob: undefined
        })
    }

    handleRemoveExercise(e) {
        const key = e.currentTarget.value

        if (key !== undefined) {
            const components = this.state.qaComponents
            delete components[key]

            this.setState({
                qaComponents: components
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
        const contentAnswer = this.state.contentAnswers

        contentAnswer[key]["is_valid"] = !contentAnswer[key]["is_valid"]

        this.setState({
            contentAnswer: contentAnswer
        })

    }

    fileChange = (e) => {
        this.setState({ image_blob: e.target.files[0] }, () => {
            console.log("File chosen --->", this.state.image_blob);
        })
    }

    createExercises([key, json_specifics]) {
        const id = "exercise-list-" + uuid()
        const html_details = json_specifics[0]
        const json_details = json_specifics[1]
        const is_valid = json_details["is_valid"]

        return <Segment onClick={this.makeExerciseValid} json_key={key} style={{ padding: "1rem" }} key={id} id={id}>
            <Button onClick={this.handleRemoveExercise} value={key} floated="right" color="red" icon="remove circle" size="mini" />
            <Button onClick={this.handleMoveDown} value={id} floated="right" color="green" icon="arrow circle down" size="mini" />
            <Button onClick={this.handleMoveUp} value={id} floated="right" color="green" icon="arrow circle up" size="mini" />
            <span style={{ cursor: "pointer" }}>{is_valid ? <b>{html_details}</b> : html_details}</span>
        </Segment>
    }

    handleAddExercise(e) {
        const components = this.state.qaComponents
        const key = uuid()

        const newAnswer = {
            "html": <span>{this.state.contentAnswer}</span>,
            "json": {
                "answer": this.state.contentAnswer,
                "is_valid": false,
                "answers": this.state.contentAnswers,
                "speech_2_text": this.state.speech_2_text,
                "image_blob": this.state.image_blob
            }
        }

        components[key] = newAnswer

        this.setState({
            contentAnswer: "",
            contentAnswers: {},
            speech_2_text: false,
            image_blob: undefined,
            qaComponents: components
        })
    }

    handleSave(e) {
        this.props.modifyModalState(false)
        this.props.modifyQaComponents(this.state.qaComponents)

        this.props.practiceHandleSave(e)
    }

    render() {
        return (
            <Modal
                closeIcon
                as={Form}
                onClose={() => this.props.modifyModalState(false)}
                open={this.props.isOpen}
            >
                <Modal.Header>Configure Exercise</Modal.Header>
                <Modal.Content>
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
                            Object.entries(this.state.qaComponents).map(this.createExercises)
                        }
                    </Segment.Group>

                    <Form.Field
                        control={Checkbox}
                        onClick={() => this.setState({ speech_2_text: !this.state.speech_2_text })}
                        label={<label>Use speech to text feature?</label>}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        content="Save"
                        labelPosition='right'
                        onClick={this.handleSave}
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        qaComponents: state.content.qaComponents,
        isOpen: state.modal.modalIsOpen,
        modalID: state.modal.modalID
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        modifyQaComponents: (element) => { dispatch(modifyQaComponents(element, 'MODIFY_QA_COMPONENTS')) },
        modifyModalState: (element) => { dispatch(modifyModalState(element, 'MODIFY_MODAL_STATE')) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseModal)

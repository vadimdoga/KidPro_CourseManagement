import React, { Component } from 'react'
import { Form, Button, Segment, Checkbox, Modal, Image } from 'semantic-ui-react'
import { v4 as uuid } from "uuid"

//redux
import { connect } from "react-redux"
import { modifyQaComponents } from "../../../redux/actions/contentActions"
import { modifyModalState, modifyModalTag } from "../../../redux/actions/modalActions"

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
        this.handleSave = this.handleSave.bind(this)

        this.state = {
            question: this.props.modalData["question"],
            contentAnswer: "",
            speech_2_text: this.props.modalData["speech_2_text"],
            images: this.props.modalData["images"],

            qaComponents: this.props.qaComponents[this.props.modalID]
        }
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
        const el_id = e.currentTarget.getAttribute('el_id')
        const element = document.querySelector("#" + el_id)

        if (element !== undefined)
            if (element.previousElementSibling) {
                const previousID = element.previousElementSibling.getAttribute('id').replace("exercise-qa-list-", "")

                const currentID = e.currentTarget.value
                const qaComponents = this.state.qaComponents

                qaComponents[currentID][1]["order"] -= 1
                qaComponents[previousID][1]["order"] += 1

                this.setState({ qaComponents: qaComponents })

                const globalQaComponents = this.props.qaComponents
                globalQaComponents[this.props.modalID] = qaComponents
                this.props.modifyQaComponents(globalQaComponents)
                console.log(this.state.qaComponents)
            }
    }

    handleMoveDown(e) {
        const el_id = e.currentTarget.getAttribute('el_id')
        const element = document.querySelector("#" + el_id)

        if (element !== undefined)
            if (element.nextElementSibling) {
                const nextID = element.nextElementSibling.getAttribute('id').replace("exercise-qa-list-", "")

                const currentID = e.currentTarget.value
                const qaComponents = this.state.qaComponents

                qaComponents[currentID][1]["order"] += 1
                qaComponents[nextID][1]["order"] -= 1

                this.setState({ qaComponents: qaComponents })

                const globalQaComponents = this.props.qaComponents
                globalQaComponents[this.props.modalID] = qaComponents
                this.props.modifyQaComponents(globalQaComponents)
            }
    }

    makeExerciseValid(e) {
        const key = e.target.getAttribute('json_key')
        let contentAnswer = this.state.qaComponents

        contentAnswer[key][1]["is_valid"] = !contentAnswer[key][1]["is_valid"]

        this.setState({
            qaComponents: contentAnswer
        })

    }

    fileChange = (e) => {
        this.setState({ images: [...this.state.images, e.target.files[0]] }, () => {
            console.log("File chosen --->", this.state.image_blob);
        })
    }

    orderContent() {
        const arr = Object.entries(this.state.qaComponents).map(this.createExercises)

        arr.sort((x, y) => {
            return ((x["order"] < y["order"]) ? -1 : ((x["order"] > y["order"]) ? 1 : 0))
        })

        return arr.map(value => value["content"])
    }

    createExercises([key, json_specifics]) {
        const id = "exercise-qa-list-" + key
        const html_details = json_specifics[0]
        const json_details = json_specifics[1]
        const is_valid = json_details["is_valid"]

        const content = <Segment style={{ padding: "1rem" }} key={id} id={id}>
            <Button onClick={this.handleRemoveExercise} value={key} floated="right" color="red" icon="remove circle" size="mini" />
            <Button onClick={this.handleMoveDown} value={key} el_id={id} floated="right" color="green" icon="arrow circle down" size="mini" />
            <Button onClick={this.handleMoveUp} value={key} el_id={id} floated="right" color="green" icon="arrow circle up" size="mini" />
            <span onClick={this.makeExerciseValid} json_key={key} style={ is_valid ? {cursor: "pointer", fontWeight: "bold"} : {cursor: "pointer"} }>{html_details}</span>
        </Segment>

        return { "content": content, "order": json_details["order"] }
    }

    handleAddExercise(e) {
        const newKey = uuid()
        let components = this.state.qaComponents
        components[newKey] = [
            <span>{this.state.contentAnswer}</span>,
            {
                "answer": this.state.contentAnswer,
                "is_valid": this.state.is_valid
            }
        ]

        this.setState({
            contentAnswer: "",
            speech_2_text: false,
            images: [],
            qaComponents: components
        })
    }

    handleSave(e) {
        const components = this.props.qaComponents

        components[this.props.modalID] = this.state.qaComponents

        this.props.modifyModalState(false)
        this.props.modifyQaComponents(components)

        this.props.saveExerciseComponent(e, {
            "question": this.state.question,
            "speech_2_text": this.state.speech_2_text,
            "images": this.state.images,
        })
    }

    render() {
        return (
            <Modal
                closeIcon
                as={Form}
                onClose={() => {
                    this.props.modifyModalState(false)
                    modifyModalTag(null)
                }}
                open={this.props.isOpen}
            >
                <Modal.Header>Configure Exercise</Modal.Header>
                <Modal.Content>
                    <Form.Input
                        fluid
                        onChange={e => this.setState({ question: e.target.value })}
                        value={this.state.question}
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
                    <Image.Group size="tiny">
                        {
                            this.state.images.map((image, idx) => {
                                return <Image key={idx} src={image} />
                            })
                        }
                    </Image.Group>
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
                            this.orderContent()
                        }
                    </Segment.Group>

                    <Form.Field
                        control={Checkbox}
                        checked={this.state.speech_2_text}
                        onChange={() => this.setState({ speech_2_text: !this.state.speech_2_text })}
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
        modalID: state.modal.modalID,
        modalData: state.modal.modalData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        modifyQaComponents: (element) => { dispatch(modifyQaComponents(element, 'MODIFY_QA_COMPONENTS')) },
        modifyModalState: (element) => { dispatch(modifyModalState(element, 'MODIFY_MODAL_STATE')) },
        modifyModalTag: (element) => { dispatch(modifyModalTag(element, 'MODIFY_MODAL_TAG')) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseModal)

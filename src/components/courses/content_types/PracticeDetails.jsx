import React, { Component } from 'react'
import { Form, Input, TextArea, Button, Segment } from 'semantic-ui-react'
import { v4 as uuid } from "uuid"

import ExerciseModal from "./ExerciseModal"

//redux
import { connect } from "react-redux"
import { modifyExerciseComponents, modifyQaComponents, modifyPracticeComponents } from "../../../redux/actions/contentActions"
import { modifyModalState, modifyModalID, modifyModalData, modifyModalTag } from '../../../redux/actions/modalActions'

const exercises_style = {
    width: "50%",
    margin: "1rem auto"
}

class PracticeDetails extends Component {
    constructor(props) {
        super(props)

        this.saveExerciseComponent = this.saveExerciseComponent.bind(this)
        this.createExpandable = this.createExpandable.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleMoveUp = this.handleMoveUp.bind(this)
        this.handleMoveDown = this.handleMoveDown.bind(this)
        this.handleModalClick = this.handleModalClick.bind(this)
        this.handleBtnClick = this.handleBtnClick.bind(this)
        this.onTypingDescription = this.onTypingDescription.bind(this)
        this.onTypingName = this.onTypingName.bind(this)

        this.state = {
            practiceName: this.props.title,
            practiceDescription: this.props.description,
            exerciseComponents: this.props.exerciseComponents[this.props.practiceID],
            typingDescriptionTimeout: 0,
            typingNameTimeout: 0
        }
    }

    handleRemove(e) {
        const key = e.currentTarget.value

        if (key !== undefined) {
            const components = this.state.exerciseComponents
            delete components[key]

            this.setState({
                exerciseComponents: components
            })
        }
    }

    handleMoveUp(e) {
        const el_id = e.currentTarget.getAttribute('el_id')
        const element = document.querySelector("#" + el_id)

        if (element !== undefined)
            if (element.previousElementSibling) {
                const previousID = element.previousElementSibling.getAttribute('id').replace("expandable-exercise-list-", "")

                const currentID = e.currentTarget.value
                const exerciseComponents = this.state.exerciseComponents

                exerciseComponents[currentID][1]["order"] -= 1
                exerciseComponents[previousID][1]["order"] += 1

                this.setState({ exerciseComponents: exerciseComponents })

                const globalExerciseComponents = this.props.exerciseComponents
                globalExerciseComponents[this.props.practiceID] = exerciseComponents
                this.props.modifyExerciseComponents(globalExerciseComponents)
            }
    }

    handleMoveDown(e) {
        const el_id = e.currentTarget.getAttribute('el_id')
        const element = document.querySelector("#" + el_id)

        if (element !== undefined)
            if (element.nextElementSibling) {
                const nextID = element.nextElementSibling.getAttribute('id').replace("expandable-exercise-list-", "")

                const currentID = e.currentTarget.value
                const exerciseComponents = this.state.exerciseComponents

                exerciseComponents[currentID][1]["order"] += 1
                exerciseComponents[nextID][1]["order"] -= 1

                this.setState({ exerciseComponents: exerciseComponents })

                const globalExerciseComponents = this.props.exerciseComponents
                globalExerciseComponents[this.props.practiceID] = exerciseComponents
                this.props.modifyExerciseComponents(globalExerciseComponents)
            }
    }

    saveExerciseComponent(e, exerciseDetails) {
        const exerciseComponents = this.state.exerciseComponents
        console.log("ex")
        console.log(exerciseComponents)


        exerciseComponents[this.props.modalID] = [
            exerciseDetails["question"],
            exerciseDetails
        ]

        this.setState({
            exerciseComponents: exerciseComponents
        })

        const exerciseGlobalComponents = this.props.exerciseComponents
        exerciseGlobalComponents[this.props.practiceID] = exerciseComponents

        this.props.modifyExerciseComponents(exerciseGlobalComponents)

    }

    handleModalClick(e, key, data) {
        this.props.modifyModalState(true)
        this.props.modifyModalID(key)
        this.props.modifyModalData(data)

        this.props.modifyModalTag(<ExerciseModal saveExerciseComponent={this.saveExerciseComponent} />)
    }

    handleBtnClick(e) {
        const newKey = uuid()
        const components = this.props.qaComponents
        components[newKey] = {}

        this.props.modifyModalState(true)
        this.props.modifyQaComponents(components)
        this.props.modifyModalID(newKey)
        this.props.modifyModalData({
            "question": "",
            "speech_to_text": false,
            "images": []
        })

        this.props.modifyModalTag(<ExerciseModal saveExerciseComponent={this.saveExerciseComponent} />)
    }

    orderContent() {
        const arr = Object.entries(this.state.exerciseComponents).map(this.createExpandable)

        arr.sort((x, y) => {
            return ((x["order"] < y["order"]) ? -1 : ((x["order"] > y["order"]) ? 1 : 0))
        })

        return arr.map(value => value["content"])
    }

    createExpandable([key, value]) {
        const id = "expandable-exercise-list-" + key
        const content = <Segment style={{ padding: "1rem" }} key={id} id={id}>
            <Button onClick={this.handleRemove} value={key} floated="right" color="red" icon="remove circle" size="mini" />
            <Button onClick={this.handleMoveDown} value={key} el_id={id} floated="right" color="green" icon="arrow circle down" size="mini" />
            <Button onClick={this.handleMoveUp} value={key} el_id={id} floated="right" color="green" icon="arrow circle up" size="mini" />
            <span style={{ cursor: "pointer" }} onClick={(e) => this.handleModalClick(e, key, value[1])}>{value[0]}</span>
            {this.props.isOpen ? this.props.modalTag : null}
        </Segment>

        return { "content": content, "order": value[1]["order"] }
    }

    onTypingDescription(e) {
        if (this.state.typingDescriptionTimeout) {
            clearTimeout(this.state.typingDescriptionTimeout);
        }

        this.setState({
            typingDescriptionTimeout: setTimeout(() => {
                const practiceGlobalComponents = this.props.practiceComponents

                const practiceJson = practiceGlobalComponents[this.props.lessonID][this.props.practiceID][1]
                practiceJson["description"] = e.target.value

                practiceGlobalComponents[this.props.lessonID][this.props.practiceID][1] = practiceJson
                this.props.modifyPracticeComponents(practiceGlobalComponents)
                console.log("description sent")
            }, 2000)
        })
    }

    onTypingName(e) {
        if (this.state.typingNameTimeout) {
            clearTimeout(this.state.typingNameTimeout);
        }

        this.setState({
            typingNameTimeout: setTimeout(() => {
                const practiceGlobalComponents = this.props.practiceComponents

                const practiceJson = practiceGlobalComponents[this.props.lessonID][this.props.practiceID][1]
                practiceJson["name"] = e.target.value

                practiceGlobalComponents[this.props.lessonID][this.props.practiceID][1] = practiceJson
                this.props.modifyPracticeComponents(practiceGlobalComponents)
                console.log("name sent")
            }, 2000)
        })
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
                        onKeyUp={this.onTypingName}
                        onChange={e => this.setState({ practiceName: e.target.value })}
                    />

                    <Form.Field
                        id='form-textarea-control-practice-description'
                        control={TextArea}
                        label='Description'
                        placeholder='Practice description'
                        value={this.state.practiceDescription}
                        onKeyUp={this.onTypingDescription}
                        onChange={e => {this.setState({ practiceDescription: e.target.value })}}
                    />
                </Form>
                <br />
                <span style={{ fontWeight: "bold", margin: "1rem" }}>Add Exercise</span>
                <Button onClick={this.handleBtnClick} style={{ marginLeft: "1rem" }} circular size="small" color="green" icon='plus circle' />

                <Segment.Group style={exercises_style}>
                    {
                        this.orderContent()
                    }
                </Segment.Group>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        exerciseComponents: state.content.exerciseComponents,
        practiceComponents: state.content.practiceComponents,
        qaComponents: state.content.qaComponents,
        isOpen: state.modal.modalIsOpen,
        modalTag: state.modal.modalTag,
        modalID: state.modal.modalID,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        modifyPracticeComponents: (element) => { dispatch(modifyPracticeComponents(element, 'MODIFY_PRACTICE_COMPONENTS')) },
        modifyExerciseComponents: (element) => { dispatch(modifyExerciseComponents(element, 'MODIFY_EXERCISE_COMPONENTS')) },
        modifyQaComponents: (element) => { dispatch(modifyQaComponents(element, 'MODIFY_QA_COMPONENTS')) },
        modifyModalState: (element) => { dispatch(modifyModalState(element, 'MODIFY_MODAL_STATE')) },
        modifyModalID: (element) => { dispatch(modifyModalID(element, 'MODIFY_MODAL_ID')) },
        modifyModalData: (element) => { dispatch(modifyModalData(element, 'MODIFY_MODAL_DATA')) },
        modifyModalTag: (element) => { dispatch(modifyModalTag(element, 'MODIFY_MODAL_TAG')) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PracticeDetails)

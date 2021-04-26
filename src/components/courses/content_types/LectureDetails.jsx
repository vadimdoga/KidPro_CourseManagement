import React, { Component } from 'react'
import { Form, Input, TextArea, Button, Segment } from 'semantic-ui-react'
import { v4 as uuid } from "uuid"

import QuestionModal from "./QuestionModal"

//redux
import { connect } from "react-redux"
import {modifyLectureComponents, modifyLectureQuestionComponents, modifyLectureQaComponents } from "../../../redux/actions/contentActions"
import { modifyModalState, modifyModalID, modifyModalData, modifyModalTag } from '../../../redux/actions/modalActions'

const exercises_style = {
    width: "50%",
    margin: "1rem auto"
}

class LectureDetails extends Component {
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
            lectureName: this.props.title,
            lectureDescription: this.props.description,
            lectureQuestionComponents: this.props.lectureQuestionComponents[this.props.lectureID],
            typingDescriptionTimeout: 0,
            typingNameTimeout: 0
        }

        this.changeGlobalLectureAttribute("name", this.props.title)
    }

    handleRemove(e) {
        const key = e.currentTarget.value

        if (key !== undefined) {
            const components = this.state.lectureQuestionComponents
            delete components[key]

            this.setState({
                lectureQuestionComponents: components
            })
        }
    }

    handleMoveUp(e) {
        const el_id = e.currentTarget.getAttribute('el_id')
        const element = document.querySelector("#" + el_id)

        if (element !== undefined)
            if (element.previousElementSibling) {
                const previousID = element.previousElementSibling.getAttribute('id').replace("expandable-question-list-", "")

                const currentID = e.currentTarget.value
                const lectureQuestionComponents = this.state.lectureQuestionComponents

                lectureQuestionComponents[currentID][1]["order"] -= 1
                lectureQuestionComponents[previousID][1]["order"] += 1

                this.setState({ lectureQuestionComponents: lectureQuestionComponents })

                const globalLectureQuestionComponents = this.props.lectureQuestionComponents
                globalLectureQuestionComponents[this.props.lectureID] = lectureQuestionComponents
                this.props.modifyLectureQuestionComponents(globalLectureQuestionComponents)
            }
    }

    handleMoveDown(e) {
        const el_id = e.currentTarget.getAttribute('el_id')
        const element = document.querySelector("#" + el_id)

        if (element !== undefined)
            if (element.nextElementSibling) {
                const nextID = element.nextElementSibling.getAttribute('id').replace("expandable-question-list-", "")

                const currentID = e.currentTarget.value
                const lectureQuestionComponents = this.state.lectureQuestionComponents

                lectureQuestionComponents[currentID][1]["order"] += 1
                lectureQuestionComponents[nextID][1]["order"] -= 1

                this.setState({ lectureQuestionComponents: lectureQuestionComponents })

                const globalLectureQuestionComponents = this.props.lectureQuestionComponents
                globalLectureQuestionComponents[this.props.lectureID] = lectureQuestionComponents
                this.props.modifyLectureQuestionComponents(globalLectureQuestionComponents)
            }
    }

    saveExerciseComponent(e, questionDetails) {
        const lectureQuestionComponents = this.state.lectureQuestionComponents
        const lectureLength = Object.keys(lectureQuestionComponents).length
        questionDetails["order"] = lectureQuestionComponents[this.props.modalID] ? lectureLength : lectureLength + 1

        lectureQuestionComponents[this.props.modalID] = [
            questionDetails["start_time"],
            questionDetails
        ]

        this.setState({
            lectureQuestionComponents: lectureQuestionComponents
        })

        const lectureGlobalComponents = this.props.lectureQuestionComponents
        lectureGlobalComponents[this.props.lectureID] = lectureQuestionComponents

        this.props.modifyLectureQuestionComponents(lectureGlobalComponents)
    }

    handleModalClick(e, key, data) {
        this.props.modifyModalState(true)
        this.props.modifyModalID(key)
        this.props.modifyModalData(data)

        this.props.modifyModalTag(<QuestionModal saveExerciseComponent={this.saveExerciseComponent} />)
    }

    handleBtnClick(e) {
        const newKey = uuid()
        const lectureQaComponents = this.props.lectureQaComponents
        lectureQaComponents[newKey] = {}

        this.props.modifyModalState(true)
        this.props.modifyLectureQaComponents(lectureQaComponents)
        this.props.modifyModalID(newKey)
        this.props.modifyModalData({
            "question": "",
            "speech_2_text": false,
            "start_time": null
        })

        this.props.modifyModalTag(<QuestionModal saveExerciseComponent={this.saveExerciseComponent} />)
    }

    orderContent() {
        const arr = Object.entries(this.state.lectureQuestionComponents).map(this.createExpandable)

        arr.sort((x, y) => {
            return ((x["order"] < y["order"]) ? -1 : ((x["order"] > y["order"]) ? 1 : 0))
        })

        return arr.map(value => value["content"])
    }

    createExpandable([key, value]) {
        const id = "expandable-question-list-" + key
        const content = <Segment style={{ padding: "1rem" }} key={id} id={id}>
            <Button onClick={this.handleRemove} value={key} floated="right" color="red" icon="remove circle" size="mini" />
            <Button onClick={this.handleMoveDown} value={key} el_id={id} floated="right" color="green" icon="arrow circle down" size="mini" />
            <Button onClick={this.handleMoveUp} value={key} el_id={id} floated="right" color="green" icon="arrow circle up" size="mini" />
            <span style={{ cursor: "pointer" }} onClick={(e) => this.handleModalClick(e, key, value[1])}>{value[0]}</span>
            {this.props.isOpen ? this.props.modalTag : null}
        </Segment>

        return { "content": content, "order": value[1]["order"] }
    }

    changeGlobalLectureAttribute(attribute, attrValue) {
        const lectureGlobalComponents = this.props.lectureComponents

        const lectureJson = lectureGlobalComponents[this.props.lessonID][this.props.lectureID][1]
        lectureJson[attribute] = attrValue

        lectureGlobalComponents[this.props.lessonID][this.props.lectureID][1] = lectureJson
        this.props.modifyLectureComponents(lectureGlobalComponents)
    }

    onTypingDescription(e) {
        if (this.state.typingDescriptionTimeout) {
            clearTimeout(this.state.typingDescriptionTimeout);
        }

        this.setState({
            typingDescriptionTimeout: setTimeout(() => {
                this.changeGlobalLectureAttribute("description", e.target.value)
                console.log("description sent")
            }, 1000)
        })
    }

    onTypingName(e) {
        if (this.state.typingNameTimeout) {
            clearTimeout(this.state.typingNameTimeout);
        }

        this.setState({
            typingNameTimeout: setTimeout(() => {
                this.changeGlobalLectureAttribute("name", e.target.value)
                console.log("name sent")
            }, 1000)
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
                        value={this.state.lectureName}
                        onKeyUp={this.onTypingName}
                        onChange={e => this.setState({ lectureName: e.target.value })}
                    />

                    <Form.Field
                        id='form-textarea-control-practice-description'
                        control={TextArea}
                        label='Description'
                        placeholder='Practice description'
                        value={this.state.lectureDescription}
                        onKeyUp={this.onTypingDescription}
                        onChange={e => { this.setState({ lectureDescription: e.target.value }) }}
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
        isOpen: state.modal.modalIsOpen,
        modalTag: state.modal.modalTag,
        modalID: state.modal.modalID,

        lectureComponents: state.content.lectureComponents,
        lectureQuestionComponents: state.content.lectureQuestionComponents,
        lectureQaComponents: state.content.lectureQaComponents
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        modifyModalState: (element) => { dispatch(modifyModalState(element, 'MODIFY_MODAL_STATE')) },
        modifyModalID: (element) => { dispatch(modifyModalID(element, 'MODIFY_MODAL_ID')) },
        modifyModalData: (element) => { dispatch(modifyModalData(element, 'MODIFY_MODAL_DATA')) },
        modifyModalTag: (element) => { dispatch(modifyModalTag(element, 'MODIFY_MODAL_TAG')) },

        modifyLectureComponents: (element) => { dispatch(modifyLectureComponents(element, 'MODIFY_LECTURE_COMPONENTS')) },
        modifyLectureQuestionComponents: (element) => { dispatch(modifyLectureQuestionComponents(element, 'MODIFY_LECTURE_QUESTION_COMPONENTS')) },
        modifyLectureQaComponents: (element) => { dispatch(modifyLectureQaComponents(element, 'MODIFY_LECTURE_QA_COMPONENTS')) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LectureDetails)

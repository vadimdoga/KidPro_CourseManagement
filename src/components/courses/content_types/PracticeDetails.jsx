import React, { Component } from 'react'
import { Form, Input, TextArea, Button, Segment } from 'semantic-ui-react'
import { v4 as uuid } from "uuid"

import ExerciseModal from "./ExerciseModal"

//redux
import { connect } from "react-redux"
import { modifyExerciseComponents, modifyQaComponents } from "../../../redux/actions/contentActions"
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

        this.state = {
            practiceName: this.props.title,
            modalTag: null,
            practiceDescription: "",
            practiceBtnKey: this.props.practiceID,
            exerciseComponents: this.props.exerciseComponents[this.props.practiceID]
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

    saveExerciseComponent(e, exerciseDetails) {
        const exerciseComponents = this.state.exerciseComponents


        exerciseComponents[this.props.modalID] = [
            <span>{ exerciseDetails["question"] }</span>,
            exerciseDetails
        ]

        this.setState({
            exerciseComponents: exerciseComponents
        })

        this.props.modifyExerciseComponents(exerciseComponents)
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
        console.log("State " + this.props.isOpen)
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

    createExpandable([key, value]) {
        const id = "expandable-list-" + uuid()
        return <Segment style={{ padding: "1rem" }} key={id} id={id}>
            <Button onClick={this.handleRemove} value={key} floated="right" color="red" icon="remove circle" size="mini" />
            <Button onClick={this.handleMoveDown} value={id} floated="right" color="green" icon="arrow circle down" size="mini" />
            <Button onClick={this.handleMoveUp} value={id} floated="right" color="green" icon="arrow circle up" size="mini" />
            <span style={{ cursor: "pointer" }} onClick={(e) => this.handleModalClick(e, key, value[1])}>{value[0]}</span>
            {this.props.isOpen ? this.props.modalTag : null}
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
                        onChange={e => this.setState({practiceName: e.target.value})}
                    />

                    <Form.Field
                        id='form-textarea-control-practice-description'
                        control={TextArea}
                        label='Description'
                        placeholder='Practice description'
                        value={this.state.practiceDescription}
                        selection
                        onChange={e => this.setState({practiceDescription: e.target.value})}
                    />
                </Form>
                <br />
                <span style={{ fontWeight: "bold", margin: "1rem" }}>Add Exercise</span>
                <Button onClick={this.handleBtnClick} style={{ marginLeft: "1rem" }} circular size="small" color="green" icon='plus circle' />

                <Segment.Group style={exercises_style}>
                    {
                        Object.entries(this.state.exerciseComponents).map(this.createExpandable)
                    }
                </Segment.Group>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        exerciseComponents: state.content.exerciseComponents,
        qaComponents: state.content.qaComponents,
        isOpen: state.modal.modalIsOpen,
        modalTag: state.modal.modalTag,
        modalID: state.modal.modalID,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        modifyExerciseComponents: (element) => { dispatch(modifyExerciseComponents(element, 'MODIFY_PRACTICE_COMPONENTS')) },
        modifyQaComponents: (element) => { dispatch(modifyQaComponents(element, 'MODIFY_QA_COMPONENTS')) },
        modifyModalState: (element) => { dispatch(modifyModalState(element, 'MODIFY_MODAL_STATE')) },
        modifyModalID: (element) => { dispatch(modifyModalID(element, 'MODIFY_MODAL_ID')) },
        modifyModalData: (element) => { dispatch(modifyModalData(element, 'MODIFY_MODAL_DATA')) },
        modifyModalTag: (element) => { dispatch(modifyModalTag(element, 'MODIFY_MODAL_TAG')) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PracticeDetails)

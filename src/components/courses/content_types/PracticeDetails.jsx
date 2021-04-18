import React, { Component } from 'react'
import { Form, Input, TextArea, Button, Segment } from 'semantic-ui-react'
import { v4 as uuid } from "uuid"

import ExerciseModal from "./ExerciseModal"

//redux
import { connect } from "react-redux"
import { modifyExerciseComponents} from "../../../redux/actions/contentActions"
import { modifyModalState, modifyModalID } from '../../../redux/actions/modalActions'

const exercises_style = {
    width: "50%",
    margin: "1rem auto"
}

class PracticeDetails extends Component {
    constructor(props) {
        super(props)

        this.handleAddContent = this.handleAddContent.bind(this)
        this.createExpandable = this.createExpandable.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleMoveUp = this.handleMoveUp.bind(this)
        this.handleMoveDown = this.handleMoveDown.bind(this)
        this.handleModalClick = this.handleModalClick.bind(this)

        this.state = {
            practiceName: this.props.title,
            practiceDescription: "",
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

    handleAddContent(e) {
        const uuidKey = uuid()

        const practiceDetails = {
            "html": "",
            "json": {
                "qaComponents": this.props.qaComponents,
                "practiceName": this.state.practiceName,
                "practiceDescription": this.state.practiceDescription
            }
        }

        let components = this.state.exerciseComponents

        components[uuidKey] = {
            "html": <span>{ practiceDetails["json"]["qaComponents"]["contentQuestion"] }</span>,
            "json": practiceDetails["json"]
        }

        this.setState({
            exerciseComponents: components
        })

        this.props.modifyExerciseComponents(components)
    }

    handleModalClick(e, key) {
        console.log(key)
        this.props.modifyModalState(true)
        this.props.modifyModalID(key)
    }

    createExpandable([key, value]) {
        const id = "expandable-list-" + uuid()
        return <Segment style={{ padding: "1rem" }} key={id} id={id}>
            <Button onClick={this.handleRemove} value={key} floated="right" color="red" icon="remove circle" size="mini" />
            <Button onClick={this.handleMoveDown} value={id} floated="right" color="green" icon="arrow circle down" size="mini" />
            <Button onClick={this.handleMoveUp} value={id} floated="right" color="green" icon="arrow circle up" size="mini" />
            <span onClick={(e) => this.handleModalClick(e, key)}>{value[0]}</span>
            {this.props.isOpen ? <ExerciseModal practiceHandleSave={this.handleAddContent} /> : ""}
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
                <Button style={{ marginLeft: "1rem" }} circular size="small" color="green" icon='plus circle' />

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
        isOpen: state.modal.modalIsOpen
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        modifyExerciseComponents: (element) => { dispatch(modifyExerciseComponents(element, 'MODIFY_PRACTICE_COMPONENTS')) },
        modifyModalState: (element) => { dispatch(modifyModalState(element, 'MODIFY_MODAL_STATE')) },
        modifyModalID: (element) => { dispatch(modifyModalID(element, 'MODIFY_MODAL_ID')) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PracticeDetails)

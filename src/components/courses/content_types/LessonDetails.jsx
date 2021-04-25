import React, { Component } from 'react'
import { Button, Form, Input, Accordion, Dropdown, TextArea } from 'semantic-ui-react'
import ExpandDetails from "../../course_components/ExpandDetails"
import PracticeDetails from "./PracticeDetails"
import PopupDetails from "../../course_components/PopupDetails"
import {prepare_practice_components} from "../../../adapters/content"
import { v4 as uuid } from "uuid"

//redux
import { connect } from "react-redux"
import { modifyPracticeComponents, modifyExerciseComponents } from "../../../redux/actions/contentActions"


const accordion_style = {
    margin: "1rem",
    width: "98%",
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


class LessonDetails extends Component {
    constructor(props) {
        super(props)

        this.handleAddContent = this.handleAddContent.bind(this)
        this.createExpandable = this.createExpandable.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleMoveUp = this.handleMoveUp.bind(this)
        this.handleMoveDown = this.handleMoveDown.bind(this)
        this.saveLesson = this.saveLesson.bind(this)

        this.state = {
            lessonName: this.props.title,
            lessonDescription: this.props.description,
            practiceType: "",
            practiceName: "",
            practiceComponents: this.props.practiceComponents[this.props.lessonID]
        }

    }

    handleRemove(e) {
        const key = e.currentTarget.value

        if (key !== undefined) {
            const components = this.state.practiceComponents
            delete components[key]

            this.setState({
                practiceComponents: components
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

    saveLesson(e) {
        console.log("Request save lesson")
        const lessons = this.props.lessonComponents[this.props.lessonID]
        lessons[1]["name"] = this.state.lessonName
        lessons[1]["description"] = this.state.lessonDescription

        console.log("Lessons")
        console.log(lessons)

        // console.log("Practices")
        // console.log(this.props.practiceComponents)

        const jsonPractices = prepare_practice_components(
            this.props.practiceComponents[this.props.lessonID],
            this.props.exerciseComponents,
            this.props.qaComponents
        )

        console.log("Practices")
        console.log(jsonPractices)


        // console.log("Exercises")
        // console.log(this.props.exerciseComponents)
        // console.log("qa")
        // console.log(this.props.qaComponents)
    }

    handleAddContent(e) {
        const uuidKey = uuid()
        let components = this.state.practiceComponents

        if (this.state.practiceType === "exercise") {
            components[uuidKey] = [
                <ExpandDetails key={uuidKey} title={this.state.practiceName} backgroundColor="white">
                    <PracticeDetails
                        lessonID={this.props.lessonID}
                        practiceID={uuidKey}
                        title={this.state.practiceName}
                        description=""
                    />
                </ExpandDetails>,
                {}
            ]

        } else if (this.state.practiceType === "lecture") {
            components[uuidKey] = [
                <ExpandDetails key={uuidKey} title={this.state.practiceName} backgroundColor="#fdfcfa">
                    This is a lecture
                </ExpandDetails>,
                {}
            ]
        }

        const exerciseComponents = this.props.exerciseComponents
        exerciseComponents[uuidKey] = []

        this.setState({
            practiceName: "",
            practiceComponents: components
        })

        const practiceGlobalComponents = this.props.practiceComponents
        practiceGlobalComponents[this.props.lessonID] = components

        this.props.modifyPracticeComponents(practiceGlobalComponents)
        this.props.modifyExerciseComponents(exerciseComponents)
    }

    createExpandable([key, value]) {
        const id = "expandable-list-" + uuid()
        return <div key={id} id={id}>
            <Button style={btn_right_style} onClick={this.handleRemove} value={key} floated="right" color="red" icon="remove circle" size="mini" />
            <Button style={btn_style} onClick={this.handleMoveDown} value={id} floated="right" color="yellow" icon="arrow circle down" size="mini" />
            <Button style={btn_style} onClick={this.handleMoveUp} value={id} floated="right" color="yellow" icon="arrow circle up" size="mini" />
            {value[0]}
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
                        selection
                        onChange={e => this.setState({ lessonDescription: e.target.value })}
                    />
                </Form>
                <br />
                <Dropdown
                    placeholder="Choose content type"
                    search
                    options={contentOptions}
                    selection
                    onChange={(e, data) => this.setState({ practiceType: data.value })}
                    value={this.state.practiceType}
                />
                <PopupDetails
                    btnColor="yellow"
                    onClickFnc={this.handleAddContent}
                    content={
                        <Input onChange={e => this.setState({ practiceName: e.target.value })} value={this.state.practiceName} style={{ marginBottom: "1rem" }} placeholder='Content Name' />
                    }
                />

                <Accordion style={accordion_style} fluid styled>
                    {
                        Object.entries(this.state.practiceComponents).map(this.createExpandable)
                    }
                </Accordion>
                <Button onClick={this.saveLesson} basic color="blue">Save</Button>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        lessonComponents: state.content.lessonComponents,
        practiceComponents: state.content.practiceComponents,
        exerciseComponents: state.content.exerciseComponents,
        qaComponents: state.content.qaComponents,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        modifyPracticeComponents: (element) => { dispatch(modifyPracticeComponents(element, 'MODIFY_PRACTICE_COMPONENTS')) },
        modifyExerciseComponents: (element) => { dispatch(modifyExerciseComponents(element, 'MODIFY_EXERCISE_COMPONENTS')) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonDetails)

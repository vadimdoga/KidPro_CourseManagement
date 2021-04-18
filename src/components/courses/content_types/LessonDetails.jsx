import React, { Component } from 'react'
import { Button, Form, Input, Accordion, Dropdown, TextArea} from 'semantic-ui-react'
import ExpandDetails from "../../course_components/ExpandDetails"
import PracticeDetails from "./PracticeDetails"
import PopupDetails from "../../course_components/PopupDetails"
import { v4 as uuid } from "uuid"

//redux
import { connect } from "react-redux"
import { modifyPracticeComponents } from "../../../redux/actions/contentActions"


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

        this.state = {
            lessonName: this.props.title,
            lessonDescription: "",
            contentType: "",
            contentName: "",
            practiceComponents: this.props.localPracticeComponents
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

    handleAddContent(e) {
        const uuidKey = uuid()
        let components = this.state.practiceComponents

        if (this.state.contentType === "exercise") {
            components[uuidKey] = <ExpandDetails key={uuidKey} title={this.state.contentName} backgroundColor="white"><PracticeDetails title={this.state.contentName} /></ExpandDetails>

        } else if (this.state.contentType === "lecture") {
            components[uuidKey] = <ExpandDetails key={uuidKey} title={this.state.contentName} backgroundColor="#fdfcfa">This is a lecture</ExpandDetails>
        }

        this.setState({
            contentName: "",
            practiceComponents: components
        })

        this.props.modifyPracticeComponents(components)
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
                    onChange={(e, data) => this.setState({ contentType: data.value })}
                    value={this.state.contentType}
                />
                <PopupDetails
                    btnColor="yellow"
                    onClickFnc={this.handleAddContent}
                    content={
                        <Input onChange={e => this.setState({ contentName: e.target.value })} value={this.state.contentName} style={{ marginBottom: "1rem" }} placeholder='Content Name' />
                    }
                />

                <Accordion style={accordion_style} fluid styled>
                    {
                        Object.entries(this.state.practiceComponents).map(this.createExpandable)
                    }
                </Accordion>
                <Button basic color="blue">Save</Button>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        practiceComponents: state.content.practiceComponents
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        modifyPracticeComponents: (element) => { dispatch(modifyPracticeComponents(element, 'MODIFY_LESSON_COMPONENTS')) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonDetails)

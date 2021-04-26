import React, { Component } from 'react'
import { v4 as uuid } from "uuid"
import { Button, Form, Input, Segment, Select, TextArea, Accordion } from 'semantic-ui-react'

import PopupDetails from "../../course_components/PopupDetails"
import HeaderComponent from "../../header/HeaderComponent"
import ExpandDetails from "../../course_components/ExpandDetails"
import LessonDetails from "../content_types/LessonDetails"
import { get_json } from "../../../adapters/auth"
import { populate_lecture_json, populate_practice_json } from "../../../adapters/content"

//redux
import { connect } from "react-redux"
import {
    modifyLessonComponents,

    modifyPracticeComponents,
    modifyExerciseComponents,
    modifyQaComponents,

    modifyLectureComponents,
    modifyLectureQaComponents,
    modifyLectureQuestionComponents
} from "../../../redux/actions/contentActions"

const gradeOptions = [
    { key: 'grade_1', text: 'Grade I', value: 'grade_1' },
    { key: 'grade_2', text: 'Grade II', value: 'grade_2' },
    { key: 'grade_3', text: 'Grade III', value: 'grade_3' },
    { key: 'grade_4', text: 'Grade IV', value: 'grade_4' },
]

const segment_style = {
    borderRadius: "25px",
    margin: "auto",
    width: "50%",
    marginBottom: "2rem",
    textAlign: "left"
}

const accordion_style = {
    marginTop: "1rem",
    textAlign: "left"
}

const btn_style = {
    marginTop: "0.5rem"
}

const btn_right_style = {
    marginTop: "0.5rem",
    marginRight: "1rem"
}

class EditCourse extends Component {
    constructor(props) {
        super(props)

        this.handleSubmitExit = this.handleSubmitExit.bind(this)
        this.handleAddExpandable = this.handleAddExpandable.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleMoveUp = this.handleMoveUp.bind(this)
        this.handleMoveDown = this.handleMoveDown.bind(this)
        this.createExpandable = this.createExpandable.bind(this)

        this.state = {
            courseName: "",
            courseDescription: "",
            grade: "",
            isPublished: false,

            accountType: "",
            authorID: "",

            lessonName: "",
            lessonComponents: {}
        }

    }

    componentDidMount() {
        const bJson = get_json()

        this.setState({
            courseName: bJson["name"],
            courseDescription: bJson["description"],
            grade: bJson["grade"],
            isPublished: bJson["published"],

            accountType: bJson["type"],
            authorID: bJson["author_id"],
        })

        const lessons = bJson["lessons"]

        let lessonComponents = this.state.lessonComponents

        let practiceComponents = this.props.practiceComponents
        let exerciseComponents = this.props.exerciseComponents
        let qaComponents = this.props.qaComponents

        let lectureComponents = this.props.lectureComponents
        let lectureQaComponents = this.props.lectureQaComponents
        let lectureQuestionComponents = this.props.lectureQuestionComponents

        lessons.forEach(lesson => {
            const lectures = lesson["lectures"]
            const lectureValues = populate_lecture_json(lesson["id"], lectures, lectureComponents, lectureQuestionComponents, lectureQaComponents)
            lectureComponents = lectureValues.lectureComponents
            lectureQuestionComponents = lectureValues.lectureQuestionComponents
            lectureQaComponents = lectureValues.lectureQaComponents

            const practices = lesson["practises"]
            const practiceValues = populate_practice_json(lesson["id"], practices, practiceComponents, exerciseComponents, qaComponents)
            practiceComponents = practiceValues.practiceComponents
            exerciseComponents = practiceValues.exerciseComponents
            qaComponents = practiceValues.qaComponents

            lessonComponents[lesson["id"]] = [
                <ExpandDetails key={lesson["id"]} title={lesson["name"]} backgroundColor="#fdfcfa" >
                    <LessonDetails
                        lessonID={lesson['id']}
                        description={lesson["description"]}
                        title={lesson["name"]}
                    />
                </ExpandDetails>,
                {
                    "name": lesson["name"],
                    "description": lesson["description"],
                    "order": lesson["order"]
                }
            ]
        });

        this.props.modifyLessonComponents(lessonComponents)

        this.props.modifyPracticeComponents(practiceComponents)
        this.props.modifyExerciseComponents(exerciseComponents)
        this.props.modifyQaComponents(qaComponents)

        this.props.modifyLectureComponents(lectureComponents)
        this.props.modifyLectureQaComponents(lectureQaComponents)
        this.props.modifyLectureQuestionComponents(lectureQuestionComponents)
    }

    handleSubmitExit(e) {
        e.preventDefault()

        this.props.history.push("/courses");
    }

    handleRemove(e) {
        const key = e.currentTarget.value

        if (key !== undefined) {
            const components = this.state.lessonComponents
            delete components[key]

            this.setState({
                lessonComponents: components
            })
        }
    }

    handleMoveUp(e) {
        const el_id = e.currentTarget.getAttribute('el_id')
        const element = document.querySelector("#" + el_id)

        if (element !== undefined)
            if (element.previousElementSibling) {
                const previousID = element.previousElementSibling.getAttribute('id').replace("expandable-lesson-list-", "")

                const currentID = e.currentTarget.value
                const lessonComponents = this.state.lessonComponents

                lessonComponents[currentID][1]["order"] -= 1
                lessonComponents[previousID][1]["order"] += 1

                this.setState({ lessonComponents: lessonComponents })
                this.props.modifyLessonComponents(lessonComponents)
            }
    }

    handleMoveDown(e) {
        const el_id = e.currentTarget.getAttribute('el_id')
        const element = document.querySelector("#" + el_id)

        if (element !== undefined)
            if (element.nextElementSibling) {
                const nextID = element.nextElementSibling.getAttribute('id').replace("expandable-lesson-list-", "")

                const currentID = e.currentTarget.value
                const lessonComponents = this.state.lessonComponents

                lessonComponents[currentID][1]["order"] += 1
                lessonComponents[nextID][1]["order"] -= 1

                this.setState({ lessonComponents: lessonComponents })
                this.props.modifyLessonComponents(lessonComponents)
            }
    }

    handleAddExpandable(e) {
        let components = this.state.lessonComponents
        const uuidKey = uuid()
        components[uuidKey] = [
            <ExpandDetails key={uuidKey} title={this.state.lessonName} backgroundColor="#fdfcfa" >
                <LessonDetails
                    lessonID={uuidKey}
                    description=""
                    title={this.state.lessonName}
                />
            </ExpandDetails>,
            {
                "name": this.state.lessonName,
                "description": "",
                "order": Object.keys(this.state.lessonComponents).length + 1
            }
        ]

        const practiceComponents = this.props.practiceComponents
        practiceComponents[uuidKey] = []

        this.props.modifyPracticeComponents(practiceComponents)

        this.setState({
            lessonComponents: components,
            lessonName: ""
        })

        this.props.modifyLessonComponents(components)
    }

    orderContent() {
        const arr = Object.entries(this.state.lessonComponents).map(this.createExpandable)

        arr.sort((x, y) => {
            return ((x["order"] < y["order"]) ? -1 : ((x["order"] > y["order"]) ? 1 : 0))
        })

        return arr.map(value => value["content"])
    }

    createExpandable([key, json_value]) {
        const id = "expandable-lesson-list-" + key
        const content = <div key={id} id={id}>
            <Button style={btn_right_style} onClick={this.handleRemove} value={key} floated="right" color="red" icon="remove circle" size="mini" />
            <Button style={btn_style} onClick={this.handleMoveDown} value={key} el_id={id} floated="right" color="teal" icon="arrow circle down" size="mini" />
            <Button style={btn_style} onClick={this.handleMoveUp} value={key} el_id={id} floated="right" color="teal" icon="arrow circle up" size="mini" />
            {json_value[0]}
        </div>

        return { "content": content, "order": json_value[1]["order"] }
    }

    render() {
        return (
            <div>
                <HeaderComponent history={this.props.history} />

                <Segment style={segment_style} color="teal" size="small">
                    <Form>
                        <Form.Group>
                            <Form.Field
                                id="form-input-control-course-name"
                                control={Input}
                                label='Course name'
                                placeholder='Mathematics'
                                width={12}
                                value={this.state.courseName}
                                onChange={e => this.setState({ courseName: e.target.value })}
                            />
                            <Form.Field
                                control={Select}
                                options={gradeOptions}
                                label={{ children: 'Grades', htmlFor: 'form-select-control-grades' }}
                                placeholder='Grades'
                                search
                                searchInput={{ id: 'form-select-control-grades' }}
                                value={this.state.grade}
                                onChange={e => this.setState({ grade: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Field
                            id='form-textarea-control-course-description'
                            control={TextArea}
                            label='Description'
                            placeholder='Course description'
                            value={this.state.courseDescription}
                            onChange={e => this.setState({ courseDescription: e.target.value })}
                        />
                        <Form.Group>
                            <Form.Button onClick={this.handleSubmitExit} content='Save changes & exit' />
                        </Form.Group>
                    </Form>
                </Segment>
                <Segment style={segment_style} color="blue" size="small">
                    <span style={{ fontWeight: "bold", margin: "1rem" }}>New Lesson</span>
                    <PopupDetails
                        btnColor="teal"
                        onClickFnc={this.handleAddExpandable}
                        content={
                            <Input onChange={e => this.setState({ lessonName: e.target.value })} value={this.state.lessonName} style={{ marginBottom: "1rem" }} placeholder='Lesson Name' />
                        }
                    />

                    <Accordion style={accordion_style} fluid styled>
                        {
                            this.orderContent()
                        }
                    </Accordion>
                </Segment>
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

        lectureComponents: state.content.lectureComponents,
        lectureQuestionComponents: state.content.lectureQuestionComponents,
        lectureQaComponents: state.content.lectureQaComponents
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        modifyLessonComponents: (element) => { dispatch(modifyLessonComponents(element, 'MODIFY_LESSON_COMPONENTS')) },

        modifyPracticeComponents: (element) => { dispatch(modifyPracticeComponents(element, 'MODIFY_PRACTICE_COMPONENTS')) },
        modifyExerciseComponents: (element) => { dispatch(modifyExerciseComponents(element, 'MODIFY_EXERCISE_COMPONENTS')) },
        modifyQaComponents: (element) => { dispatch(modifyQaComponents(element, 'MODIFY_QA_COMPONENTS')) },

        modifyLectureComponents: (element) => { dispatch(modifyLectureComponents(element, 'MODIFY_LECTURE_COMPONENTS')) },
        modifyLectureQuestionComponents: (element) => { dispatch(modifyLectureQuestionComponents(element, 'MODIFY_LECTURE_QUESTION_COMPONENTS')) },
        modifyLectureQaComponents: (element) => { dispatch(modifyLectureQaComponents(element, 'MODIFY_LECTURE_QA_COMPONENTS')) },

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCourse)

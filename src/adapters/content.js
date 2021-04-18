import { v4 as uuid } from "uuid"
import ExpandDetails from "../components/course_components/ExpandDetails"
import PracticeDetails from "../components/courses/content_types/PracticeDetails"
import LectureDetails from "../components/courses/content_types/LectureDetails"

const create_missing_field = (json_data, field_name, field_type) => {
    const field = json_data[field_name]

    if (field === undefined)
        json_data[field_name] = field_type

    return json_data
}

export function populate_lecture_json(lessonID, lectures, lectureComponents, exerciseComponents, qaComponents) {
    lectures.forEach(lecture => {
        const lectureID = lecture["id"]
        lectureComponents = create_missing_field(lectureComponents, lessonID, {})
        lectureComponents[lessonID][lectureID] = {
            "html_data": <ExpandDetails key={uuid()} title="Basic Fractions" backgroundColor="#fdfcfa" ><LectureDetails title="Basic Fractions" /></ExpandDetails>,
            "json_data": {
                "name": lecture["name"],
                "description": lecture["description"],
                "order": lecture["order"],
                "video": lecture["video"],
                "images": lecture["images"]
            }
        }

        const questions = lecture["questions"]
        questions.forEach(question => {
            const questionID = question["id"]
            exerciseComponents = create_missing_field(exerciseComponents, lectureID, {})
            exerciseComponents[lectureID][questionID] = {
                "html_data": <span>to be implemented</span>,
                "json_data": {
                    "speech_to_text": question["speech_to_text"],
                    "order": question["order"],
                    "images": question["images"],
                    "question": question["question"],
                    "start_time": question["start_time"],
                }
            }

            const answers = question["answers"]
            answers.forEach(answer => {
                const uuidKey = uuid()
                qaComponents = create_missing_field(qaComponents, questionID, {})
                qaComponents[questionID][uuidKey] = {
                    "html_data": <span>to be implemented</span>,
                    "json_data": {
                        "answer": answer["answer"],
                        "is_valid": answer["is_Right"],
                        "order": answer["order"]
                    }
                }
            })
        })

    })

    return {
        "lectureComponents": lectureComponents,
        "exerciseComponents": exerciseComponents,
        "qaComponents": qaComponents
    }
}

export function populate_practice_json(lessonID, practices, practiceComponents, exerciseComponents, qaComponents) {
    practices.forEach(practice => {
        const practiceID = practice["id"]
        practiceComponents = create_missing_field(practiceComponents, lessonID, {})
        practiceComponents[lessonID][practiceID] = [
            <ExpandDetails key={lessonID} title={practice["name"]} backgroundColor="white" ><PracticeDetails practiceID={practiceID} title={practice["name"]} /></ExpandDetails>,
            {
                "name": practice["name"],
                "description": practice["description"],
                "order": practice["order"]
            }
        ]

        const exercises = practice["exercises"]
        exercises.forEach(exercise => {
            const exerciseID = exercise["id"]
            exerciseComponents = create_missing_field(exerciseComponents, practiceID, {})
            exerciseComponents[practiceID][exerciseID] = [
                exercise["question"],
                {
                    "speech_to_text": exercise["speech_to_text"],
                    "order": exercise["order"],
                    "images": exercise["images"],
                    "question": exercise["question"],
                    "start_time": exercise["start_time"],
                }
            ]

            const answers = exercise["answers"]
            answers.forEach(answer => {
                const uuidKey = uuid()
                qaComponents = create_missing_field(qaComponents, exerciseID, {})
                qaComponents[exerciseID][uuidKey] = [
                    answer["answer"],
                    {
                        "answer": answer["answer"],
                        "is_valid": answer["is_Right"],
                        "order": answer["order"]
                    }
                ]
            })
        })
    })
    return {
        "practiceComponents": practiceComponents,
        "exerciseComponents": exerciseComponents,
        "qaComponents": qaComponents
    }
}

const initState = {
    lessonComponents: {},
    practiceComponents: {},
    lectureComponents: {},
    exerciseComponents: {},
    qaComponents: {}
}

const contentReducer = (state = initState, action) => {
    if (action.type === 'MODIFY_EXERCISE_COMPONENTS') {
        const exerciseComponents = action.element

        return {
            ...state,
            exerciseComponents: exerciseComponents
        }
    } else if (action.type === 'MODIFY_LESSON_COMPONENTS') {
        const lessonComponents = action.element

        return {
            ...state,
            lessonComponents: lessonComponents
        }
    } else if (action.type === 'MODIFY_PRACTICE_COMPONENTS') {
        const practiceComponents = action.element

        return {
            ...state,
            practiceComponents: practiceComponents
        }
    } else if (action.type === 'MODIFY_LECTURE_COMPONENTS') {
        const lectureComponents = action.element

        return {
            ...state,
            lectureComponents: lectureComponents
        }
    } else if (action.type === 'MODIFY_QA_COMPONENTS') {
        const qaComponents = action.element

        return {
            ...state,
            qaComponents: qaComponents
        }
    }

    return state
}

export default contentReducer

const initState = {
    lessons: [],
    lessonContent: {}
}

const lessonReducer = (state = initState, action) => {
    if (action.type === 'CONFIGURE_LESSON') {
        const lessonDetails = action.element

        return {
            ...state,
            lessonContent: lessonDetails
        }
    } else if (action.type === 'ADD_LESSON') {
        return {
            ...state,
            lessons: [...state.lessons, state.lessonContent]
        }
    }
}

export default lessonReducer

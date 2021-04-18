const initState = {
    modalIsOpen: false,
    modalId: ""
}

const modalReducer = (state = initState, action) => {
    if (action.type === 'MODIFY_MODAL_STATE') {
        const newModalState = action.element

        return {
            ...state,
            modalIsOpen: newModalState
        }
    } else if (action.type === 'MODIFY_MODAL_ID') {
        const newModalID = action.element

        return {
            ...state,
            modalID: newModalID
        }
    }

    return state
}

export default modalReducer

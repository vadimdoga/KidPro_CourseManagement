const initState = {
    modalIsOpen: false
}

const modalReducer = (state = initState, action) => {
    if (action.type === 'MODIFY_MODAL_STATE') {
        const newModalState = action.element

        return {
            ...state,
            modalIsOpen: newModalState
        }
    }

    return state
}

export default modalReducer

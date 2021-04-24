const initState = {
    modalIsOpen: false,
    modalId: "",
    modalTag: null,
    modalData: {}
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
    } else if (action.type === 'MODIFY_MODAL_DATA') {
        const newModalData = action.element

        return {
            ...state,
            modalData: newModalData
        }
    } else if (action.type === 'MODIFY_MODAL_TAG') {
        const newModalTag = action.element

        return {
            ...state,
            modalTag: newModalTag
        }
    }

    return state
}

export default modalReducer

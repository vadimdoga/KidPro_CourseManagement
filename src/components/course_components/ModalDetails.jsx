import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'

//redux
import { connect } from "react-redux"
import { modifyModalState } from "../../redux/actions/modalActions"


class ModalDetails extends Component {
    constructor(props) {
        super(props)

        this.handleSave = this.handleSave.bind(this)
    }

    handleSave(e) {
        this.setState({ isOpen: false })

        return this.props.exerciseHandleSave(e)
    }

    render() {
        return (
            <Modal
                closeIcon
                onClose={() => this.props.modifyModalState(false)}
                onOpen={() => this.props.modifyModalState(true)}
                open={this.props.isOpen}
                trigger={<Button style={{ marginLeft: "1rem" }} circular size="small" color={this.props.btnColor} icon='plus circle' />}
            >
                <Modal.Header>Configure Exercise</Modal.Header>
                <Modal.Content>
                    {this.props.children}
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        content="Save"
                        labelPosition='right'
                        onClick={this.handleSave}
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isOpen: state.modalIsOpen
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        modifyModalState: (element) => { dispatch(modifyModalState(element, 'MODIFY_MODAL_STATE')) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalDetails)

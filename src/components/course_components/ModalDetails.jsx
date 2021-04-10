import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'

export default class ModalDetails extends Component {
    constructor(props) {
        super(props)

        this.handleSave = this.handleSave.bind(this)
        this.handleClose = this.handleClose.bind(this)

        this.state = {
            isOpen: false
        }
    }

    handleClose(e) {
        this.setState({ isOpen: false })

        this.props.handleClose(e)
    }

    handleSave(e) {
        this.setState({ isOpen: false })

        return this.props.onClickFnc(e)
    }

    render() {
        return (
            <Modal
                closeIcon
                onClose={this.handleClose}
                onOpen={() => this.setState({isOpen: true})}
                open={this.state.isOpen}
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

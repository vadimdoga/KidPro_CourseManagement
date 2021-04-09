import React, { Component } from 'react'
import { Button, Popup } from 'semantic-ui-react'

export default class PopupDetails extends Component {
    constructor(props) {
        super(props)

        this.appendContent = this.appendContent.bind(this)

    }

    appendContent() {
        return <div>
            {this.props.content}
            <Button onClick={this.props.onClickFnc} basic color={this.props.btnColor} content='Save Exercise' />
        </div>
    }

    render() {
        return (
            <Popup
                trigger={<Button style={{ marginLeft: "1rem" }} circular size="small" color={this.props.btnColor} icon='plus circle' />}
                content={this.appendContent}
                on='click'
            />
        )
    }
}

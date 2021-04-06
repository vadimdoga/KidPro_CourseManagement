import React, { Component } from 'react'
import { Accordion, Button, Icon } from 'semantic-ui-react'


export default class ExpandDetails extends Component {
    constructor(props) {
        super(props)

        this.handleClick = this.handleClick.bind(this)

        this.state = {
            activeIndex: this.props.ind
        }
    }

    handleClick(e, titleProps) {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }

    render() {
        return (
            <div>
                <Accordion.Title
                    active={this.state.activeIndex === 0}
                    index={0}
                    onClick={this.handleClick}
                >
                    <Icon name='dropdown' />
                    {this.props.title}
                </Accordion.Title>

                <Accordion.Content active={this.state.activeIndex === 0}>
                    {this.props.children}
                </Accordion.Content>
            </div>
        )
    }
}

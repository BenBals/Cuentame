import React from 'react'

export default class RandomGif extends React.Component {
    constructor (props) {
        super(props)
        this.state = {url: ''}
    }

    componentDidMount () {
        var req = new XMLHttpRequest()
            req.open('GET', 'http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=cat')
            req.addEventListener('load', res => {
                console.log(res)
                let data = JSON.parse(res.target.response)
                this.setState({url: data.data.image_url})
            })
            req.send()
    }

    render () {
        return (
            <div>
                <img src={this.state.url}/>
            </div>
        )
    }
}

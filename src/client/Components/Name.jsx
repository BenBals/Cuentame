// react lib
import React from 'react'

// dynamic lang files
import lang from '../lang.jsx'

// the component that gets your name
export default class Name extends React.Component {
  render() {
    // the function that handels the submit event
    const handleSubmit = (event) => {
      // do not reload
      event.preventDefault()
      // call the setName function with the value of the input
      this.props.setName(this.nameInp.value)
      return false
    }

    return (
      <div>
        {/* the right heading */}
        <h2 className="text-align-center">{lang.whatsYourName}</h2>
        {/* the form that gets the name */}
        <form onSubmit={handleSubmit}>
          {/* the input with the ref, so we can easily get it*/}
          <div className="input-field">
            <input type="text" placeholder={lang.yourName} id="name-input" ref={(ref) => this.nameInp = ref}/>
          </div>
          
          <input className="waves-effect waves-light btn" type="submit" value={lang.next} />
        </form>
      </div>
    )
  }
}

import React from 'react'

import lang from '../lang.jsx'

export default class Name extends React.Component {
  render() {
    const handleSubmit = (event) => {
      // console.log(this.nameInp)
      event.preventDefault()
      this.props.setName(this.nameInp.value)
      return false
    }

    return (
      <div>
        <h2>{lang.whatsYourName}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder={lang.yourName} ref={(ref) => this.nameInp = ref}/>
          <input type="submit" value={lang.next} />
        </form>
      </div>
    )
  }
}

import React from 'react';




class Biggie extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div>
        <p>{this.props.bar} and I spit hot fire</p>
      </div>
    )
  }
}


export default Biggie;
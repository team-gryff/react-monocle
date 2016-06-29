import React from 'react';


class BIG extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let favorite;
    if (foo) favorite = 'Notorious BIG'
    else favorite = '2pac'
    return(
      <div onClick ={this.props.click}>
      <p>{favorite} is my favorite rapper! </p>
      </div>
    )
  }
}


export default BIG;
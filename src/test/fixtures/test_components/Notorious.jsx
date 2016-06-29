import React from 'react';


class Notorious extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div>
      {this.props.bar}, and I like it when you call me big poppa
      <BIG
        foo={this.props.foo}
        click={this.props.click}
      />
      </div>
    )
  }
}


export default Notorious;
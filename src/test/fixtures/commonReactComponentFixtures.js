module.exports = {
  forLoopComponentFixture: `
    var Main = React.createClass({
      render: function() {
        var items = [];
        for (let i = 0; i < this.props.test.length; i++) {
          items.push(<ListItem 
            onChange={this.handleChange}
            onSubmit={this.handleSubmit} />);
        }
        return <div>
          {items}
        </div>
      }
    });
  `,
  mapComponentFixture: `
    var Main = React.createClass({
      render: function() {
        var items = this.props.test.map(item => <ListItem
          onChange={this.handleChange}
          onSubmit={this.handleSubmit} />);
        return <div>
          {items}
        </div>
      }
    });
  `,

  forIn: `
    class Foo extends React.Component {
      constuctor() {
        super();
      }



      render() {
        const renderArr = [];
        for (const key in this.props.bar) {
          renderArr.push(<Bar 
            ayy={this.props.bar[key]}
          />)
        }

        return (
          <div>
            {renderArr}
          </div>
        )
      }
    }
  `,

  forLoop: `
    class Foo extends React.Component {
      constuctor() {
        super();
      }



      render() {
        const renderArr = [];
        for (let i =0; i < this.props.bar.length; i++) {
          renderArr.push(<Bar 
            ayy={this.props.bar[i]}
          />)
        }

        return (
          <div>
            {renderArr}
          </div>
        )
      }
    }
  
  `,
    mapFunc: `
    class Foo extends React.Component {
      constuctor() {
        super();
      }



      render() {
        const renderArr = this.props.bar.map(ele => {
          return (<Bar ayy={ele.lol} />)
        })

        return (
          <div>
            {renderArr}
          </div>
        )
      }
    }
  `,

};
import React, { Component } from 'react';
import { connect } from 'react-redux';

export default function (ComposedComponent) {
  class Authentication extends Component {
    static contextTypes = {
      router: React.PropTypes.object,
    }

    componentWillMount() {
      // console.log('require auth ------'+this.props.authenticated)
      if (!this.props.authenticated) {
        this.context.router.push('/shop/signin')
      }
      else{
        if(this.props.cat!=='1'){
          // console.log('cat bad')
          this.context.router.push('/shop/admin')
        }
      }
    }

    componentWillUpdate(nextProps) {

      if (!nextProps.authenticated) {
        this.context.router.push('/shop/signin');
        // console.log('require auth ------push home')
        // window.location.href = '/'
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return { 
      authenticated: state.auth.authenticated,
      cat:state.auth.cat
     };
    // return state;
  }

  return connect(mapStateToProps)(Authentication);
}

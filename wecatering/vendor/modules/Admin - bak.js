
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Grid, Row, Col ,Button} from 'react-bootstrap'
import { Nav,NavItem} from 'react-bootstrap'


class Admin extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      selectedKey: 1,
    };
    this.handleSelect = this.handleSelect.bind(this)
  }
  contextTypes: {
    router: React.PropTypes.object
  }
  componentWillMount() {
      if (!this.props.authenticated) {
        // this.props.router.push('/shop/signin')
        console.log('redirect')
        window.location.href = '/shop/signin';
      }
      /*else{
        if(this.props.cat!==1){
          this.props.router.push('/shop/admin')
          console.log('cat 2')
        }
      }*/
    }
  componentDidMount() {
    switch(this.props.location.pathname)
      {
      case ("/shop"+"/admin"+"/canteen"):
        this.setState({selectedKey:2});
        break;
      case ("/shop"+"/admin"+"/recipe"):
        this.setState({selectedKey:3});
        break;
      case ("/shop"+"/admin"+"/report"):
        this.setState({selectedKey:4});
        break;
      case ("/shop"+"/admin"+"/checked"):
        this.setState({selectedKey:5});
        break;
      case ("/shop"+"/admin"+"/order"):
        this.setState({selectedKey:6});
        break;
      default:
        this.setState({selectedKey:1});
      }
  }

  handleSelect(eventKey,event) {
    event.preventDefault();
    this.setState({selectedKey:eventKey});
    // this.props.router.push(event.target.href)
    switch(eventKey)
      {
      case 2:
        this.props.router.push("/shop/admin/canteen");
        break;
      case 3:
        this.props.router.push("/shop/admin/recipe");
        break;
      case 4:
        this.props.router.push("/shop/admin/report");
        break;
      case 5:
        this.props.router.push("/shop/admin/checked");
        break;
      case 6:
        this.props.router.push("/shop/admin/order");
        break;
      default:
        this.props.router.push("/shop/admin");
      }
  }

  render() {
    // <Row>
    // </Row>
    return (
      <div>
        <div className="a-content">
          <Col md={2} sm={2} className="a-nav">
            <div className="sideNavWrap">
              {
                this.props.cat==1&&this.props.authenticated?
                <div >
                  <Nav bsStyle="custom" stacked className="navtab noprint" activeKey={this.state.selectedKey} 
                    onSelect={this.handleSelect}>
                    <NavItem className={this.state.selectedKey===1?"navtabAct":"navtabInact"} eventKey={1} href={"/shop/admin"}>
                      <span  >未结订单</span>
                    </NavItem>
                    <NavItem className={this.state.selectedKey===5?"navtabAct":"navtabInact"} eventKey={5} href={"/shop/admin"+"/checked"}>
                      <span  >已结订单</span>
                    </NavItem>
                    <NavItem className={this.state.selectedKey===2?"navtabAct":"navtabInact"} eventKey={2} href={"/shop/admin"+"/canteen"}>
                      <span  >餐厅信息</span>
                    </NavItem>
                    <NavItem className={this.state.selectedKey===3?"navtabAct":"navtabInact"} eventKey={3} href={"/shop/admin"+"/recipe"}>
                      <span  >菜谱信息</span>
                    </NavItem>
                    <NavItem className={this.state.selectedKey===4?"navtabAct":"navtabInact"} eventKey={4} href={"/shop/admin"+"/report"}>
                      <span >报表</span>
                    </NavItem>
                    <NavItem className={this.state.selectedKey===6?"navtabAct":"navtabInact"} eventKey={6} href={"/shop/admin"+"/order"}>
                      <span >堂食点餐</span>
                    </NavItem>
                  </Nav>
                  
                </div>  
              :
              null
              }
            </div>
            <div className="sideNavWrap">
              {
                this.props.cat==2&&this.props.authenticated?
                <div>
                <Nav bsStyle="custom" stacked className="navtab noprint" activeKey={this.state.selectedKey} 
              onSelect={this.handleSelect}>
                <NavItem className={this.state.selectedKey===1?"navtabAct":"navtabInact"} eventKey={1} href={"/shop/admin"}>
                  <span  >未结订单</span></NavItem>
                <NavItem className={this.state.selectedKey===5?"navtabAct":"navtabInact"} eventKey={5} href={"/shop/admin"+"/checked"}>
                <span >已结订单</span></NavItem>
              </Nav>
               
               </div>
              :
              null
              }

            </div>
            <div className="a-bottom">1</div>
          </Col>
        </div>

        <Col md={10} sm={10}>
        <div className="page-content-wrapper">

          {this.props.children}

        </div>
        </Col>
      </div>
    )
  }
}

export default Admin

/*

        <div>
          {
            this.props.cat==1&&this.props.authenticated?
            <div >
              <Nav bsStyle="tabs" className="navtab noprint" activeKey={this.state.selectedKey} 
                onSelect={this.handleSelect}>
                <NavItem className="navtabItem" eventKey={1} href={"/shop/admin"}>
                  <span className="navtabTxt" >未结订单</span>
                </NavItem>
                <NavItem className="navtabItem" eventKey={5} href={"/shop/admin"+"/checked"}>
                  <span className="navtabTxt" >已结订单</span>
                </NavItem>
                <NavItem className="navtabItem" eventKey={2} href={"/shop/admin"+"/canteen"}>
                  <span className="navtabTxt" >餐厅信息</span>
                </NavItem>
                <NavItem className="navtabItem" eventKey={3} href={"/shop/admin"+"/recipe"}>
                  <span className="navtabTxt" >菜谱信息</span>
                </NavItem>
                <NavItem className="navtabItem" eventKey={4} href={"/shop/admin"+"/report"}>
                  <span className="navtabTxt" >报表</span>
                </NavItem>
              </Nav>
              {this.props.children}
            </div>
          :
          null
          }

          {
            this.props.cat==2&&this.props.authenticated?
            <div>
            <Nav bsStyle="tabs" className="navtab noprint" activeKey={this.state.selectedKey} 
          onSelect={this.handleSelect}>
            <NavItem className="navtabItem" eventKey={1} href={"/shop/admin"}>
              <span className="navtabTxt" >未结订单</span></NavItem>
            <NavItem className="navtabItem" eventKey={5} href={"/shop/admin"+"/checked"}>
            <span className="navtabTxt" ></span></NavItem>
          </Nav>
           {this.props.children}
           </div>
          :
          null
          }
          
        </div>
 */

/*
        <div>
          {
            this.props.cat==1&&this.props.authenticated?
            <div >
              <Nav bsStyle="tabs" className="navtab noprint" activeKey={this.state.selectedKey} 
                onSelect={this.handleSelect}>
                <NavItem  eventKey={1} href={"/shop/admin"}>
                  <span className={this.state.selectedKey===1?"navtabAct":"navtabInact"} >未结订单</span>
                </NavItem>
                <NavItem  eventKey={5} href={"/shop/admin"+"/checked"}>
                  <span className={this.state.selectedKey===5?"navtabAct":"navtabInact"} >已结订单</span>
                </NavItem>
                <NavItem  eventKey={2} href={"/shop/admin"+"/canteen"}>
                  <span className={this.state.selectedKey===2?"navtabAct":"navtabInact"} >餐厅信息</span>
                </NavItem>
                <NavItem  eventKey={3} href={"/shop/admin"+"/recipe"}>
                  <span className={this.state.selectedKey===3?"navtabAct":"navtabInact"} >菜谱信息</span>
                </NavItem>
                <NavItem  eventKey={4} href={"/shop/admin"+"/report"}>
                  <span className={this.state.selectedKey===4?"navtabAct":"navtabInact"} >报表</span>
                </NavItem>
              </Nav>
              {this.props.children}
            </div>
          :
          null
          }

          {
            this.props.cat==2&&this.props.authenticated?
            <div>
            <Nav bsStyle="tabs" className="navtab noprint" activeKey={this.state.selectedKey} 
          onSelect={this.handleSelect}>
            <NavItem  eventKey={1} href={"/shop/admin"}>
              <span className={this.state.selectedKey===1?"navtabAct":"navtabInact"} >未结订单</span></NavItem>
            <NavItem  eventKey={5} href={"/shop/admin"+"/checked"}>
            <span className={this.state.selectedKey===5?"navtabAct":"navtabInact"} ></span></NavItem>
          </Nav>
           {this.props.children}
           </div>
          :
          null
          }
          
        </div>
 */
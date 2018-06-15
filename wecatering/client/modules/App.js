import React from 'react'
import { connect } from 'react-redux'
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

class App extends React.Component{
  render() {
    return (
      <div >
        <Grid>
          <Row className="show-grid">
            <Col xs={12}  sm={12} md={4} mdOffset={4}>
              {this.props.children}
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}
export default App

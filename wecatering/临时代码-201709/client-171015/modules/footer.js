import React from "react"
//import throttle from "lodash.throttle"
export default class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
      <hr className="style2"/>
      <p className="text-center">
          <a href="https://github.com/Paqmind/react-ultimate" target="_blank">
            <span className="fa fa-github fa-lg margin-right-xs"></span> Demo
          </a>
        </p>
        <p className="text-center">
          <span className="fa fa-copyright margin-right-xs"></span> <a href="#" target="_blank">wecate</a>
        </p>
      </footer>
    )
  }
}

export default function withLazyLoading(
  getComponent,
  Spinner = null,
  onError = noop,
) {
    return class LazyLoadingWrapper extends React.Component {
        state = {
            Component: null,
        }

        componentWillMount() {
            console.log('load ok************1')
            console.log(this.props)
            const { onLoadingStart, onLoadingEnd, onError } = this.props
            console.log('load ok************2')
            // onLoadingStart()
            console.log('load ok************3')
            // Before the wrapper component mounts we fire importer function
            getComponent()
                .then(esModule => {
                    // and store the component in state
                    this.setState({ Component: esModule.default })
                    console.log('load ok************')
                })
                .catch(err => {
                    onError(err, this.props)
                })
        }

        render() {
            const { Component } = this.state

            // if (!Component) return Spinner
            if (!Component) return <div>hi</div>

            return <Component {...this.props} />
        }
    }
}

function noop() {
    console.log(err)
}
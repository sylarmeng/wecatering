

// import Chart from './chart'

import withLazyLoading from './lazycomp'

export default withLazyLoading(
  () => import(/* webpackChunkName: "chart" */ './chart')
    ,null
  // ,<Loading type="spinner" />
)
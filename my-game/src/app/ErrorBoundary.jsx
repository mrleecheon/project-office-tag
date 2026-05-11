import { Component } from 'react'
import ErrorPanel from '../ui/feedback/ErrorPanel'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[GameErrorBoundary]', error, info?.componentStack)
  }

  render() {
    if (this.state.error) return <ErrorPanel error={this.state.error} />
    return this.props.children
  }
}

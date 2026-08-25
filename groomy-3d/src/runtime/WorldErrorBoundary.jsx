import { Component } from 'react'

export default class WorldErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {}

  render() {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}

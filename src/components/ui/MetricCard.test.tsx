import { render, screen } from '@testing-library/react'
import MetricCard from './MetricCard'

describe('MetricCard', () => {
  it('renders label and value', () => {
    render(<MetricCard label="Flood Exposure" value="84" unit="/100" />)
    expect(screen.getByText('Flood Exposure')).toBeInTheDocument()
    expect(screen.getByText('84')).toBeInTheDocument()
    expect(screen.getByText('/100')).toBeInTheDocument()
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ContractAddress } from '../components/ContractAddress'

const ADDRESS = '0xAbC1230000000000000000000000000000009fEd'

let writeText: ReturnType<typeof vi.fn>

function setClipboard(impl: () => Promise<void>) {
  writeText = vi.fn(impl)
  Object.defineProperty(globalThis.navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
    writable: true,
  })
}

beforeEach(() => {
  setClipboard(() => Promise.resolve())
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ContractAddress', () => {
  it('shows the full address, never a truncation', () => {
    render(<ContractAddress label="Contract address" address={ADDRESS} />)
    expect(screen.getByText(ADDRESS)).toBeTruthy()
  })

  it('copies the full address and reports success', async () => {
    render(<ContractAddress label="Contract address" address={ADDRESS} />)
    fireEvent.click(screen.getByRole('button', { name: /copy contract address/i }))

    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Copied'))
    expect(writeText).toHaveBeenCalledTimes(1)
    expect(writeText).toHaveBeenCalledWith(ADDRESS)
  })

  it('reports a failure when the clipboard rejects', async () => {
    setClipboard(() => Promise.reject(new Error('denied')))
    render(<ContractAddress label="Contract address" address={ADDRESS} />)
    fireEvent.click(screen.getByRole('button', { name: /copy contract address/i }))

    await waitFor(() =>
      expect(screen.getByRole('status').textContent).toMatch(/copy failed/i),
    )
  })

  it('reports a failure when the browser exposes no clipboard', async () => {
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: undefined,
      configurable: true,
      writable: true,
    })
    render(<ContractAddress label="Contract address" address={ADDRESS} />)
    fireEvent.click(screen.getByRole('button', { name: /copy contract address/i }))

    await waitFor(() =>
      expect(screen.getByRole('status').textContent).toMatch(/copy failed/i),
    )
  })

  it('links to the explorer with the full address when one is configured', () => {
    render(
      <ContractAddress
        label="Contract address"
        address={ADDRESS}
        explorerUrl="https://robinhoodchain.blockscout.com/"
      />,
    )
    const link = screen.getByRole('link', { name: /view on explorer/i })
    expect(link.getAttribute('href')).toBe(
      `https://robinhoodchain.blockscout.com/address/${ADDRESS}`,
    )
  })
})

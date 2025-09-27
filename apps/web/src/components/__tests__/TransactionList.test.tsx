import { render, screen } from '@testing-library/react'
import { TransactionList, Transaction } from '../Auth/TransactionList'
import { ledgerEntryEnum } from '../../constants/ledgerEntryEnum'
import '@testing-library/jest-dom'

// Mock dos ícones
jest.mock('lucide-react', () => ({
  ArrowUpRight: () => <div data-testid="arrow-up-right-icon" />,
  ArrowDownLeft: () => <div data-testid="arrow-down-left-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  XCircle: () => <div data-testid="x-circle-icon" />,
  ReceiptText: () => <div data-testid="receipt-text-icon" />,
  RefreshCw: () => <div data-testid="refresh-icon" />,
}))

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: ledgerEntryEnum.CREDIT,
    value: 100.50,
    description: 'PIX recebido',
    sender: 'João Silva',
    date: '2024-01-15T10:30:00Z',
    status: 'COMPLETED',
  },
  {
    id: '2',
    type: ledgerEntryEnum.DEBIT,
    value: 50.25,
    description: 'PIX enviado',
    recipient: 'Maria Santos',
    date: '2024-01-14T15:45:00Z',
    status: 'FAILED',
  },
]

it('should display completed transaction successfully', () => {
  const successTransaction = [mockTransactions[0]]
  render(<TransactionList transactions={successTransaction} />)
  
  expect(screen.getByText('PIX recebido')).toBeInTheDocument()
  expect(screen.getByText('+R$ 100,50')).toBeInTheDocument()
  expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument()
  expect(screen.getByText('De: João Silva')).toBeInTheDocument()
})

it('should display transaction with expected failure', () => {
  const failedTransaction = [mockTransactions[1]]
  render(<TransactionList transactions={failedTransaction} />)
  
  expect(screen.getByText('PIX enviado')).toBeInTheDocument()
  expect(screen.getByText('-R$ 50,25')).toBeInTheDocument()
  expect(screen.getByTestId('x-circle-icon')).toBeInTheDocument()
  expect(screen.getByText('Para: Maria Santos')).toBeInTheDocument()
})

it('should display empty list when there are no transactions', () => {
  render(<TransactionList transactions={[]} />)
  
  expect(screen.getByText('No momento não tem histórico de transações')).toBeInTheDocument()
  expect(screen.getByText('Suas transações aparecerão aqui quando realizadas')).toBeInTheDocument()
})

it('should display all provided transactions', () => {
  render(<TransactionList transactions={mockTransactions} />)
  
  expect(screen.getByText('PIX recebido')).toBeInTheDocument()
  expect(screen.getByText('PIX enviado')).toBeInTheDocument()
  expect(screen.getByText('+R$ 100,50')).toBeInTheDocument()
  expect(screen.getByText('-R$ 50,25')).toBeInTheDocument()
})
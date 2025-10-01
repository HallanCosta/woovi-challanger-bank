# Frontend - Woovi Challenger Bank

Modern and responsive interface built with React.js, TypeScript and Shadcn, offering a complete banking experience with PIX, account management and transactions.

## 🏗️ Architecture

### Technology Stack
- **Framework**: React.js with TypeScript
- **Styling**: Tailwind CSS + Shadcn
- **API Client**: Relay GraphQL
- **Testing**: Jest + React Testing Library

## 🚀 Features

### 🔐 Authentication
- **Login**: Form with validation
- **Session Management**: localStorage with automatic verification

### 💳 Banking Dashboard
- **Balance Card**: Balance visualization with visibility toggle
- **Statement**: Transaction list with updates
- **PIX Transfers**: Modal for PIX sending
- **Favorites**: Contact list for quick transfers
- **Quick Actions**: Direct access buttons to functionalities

## 🧪 Testing

### Configuration
- **Framework**: Jest + React Testing Library
- **Coverage**: Complete component coverage
- **Mocks**: Mocks for hooks and APIs

### Tested Components
- ✅ `Login` - Authentication and validation
- ✅ `TransactionList` - Transaction list
- ✅ `TransferModal` - Transfer modal

## 🚀 Available Scripts

```bash
# Development
pnpm dev                 # Start development server
pnpm build              # Production build
pnpm start              # Start production server

# Relay
pnpm relay              # Compile GraphQL queries

# Testing
pnpm test               # Run tests
```
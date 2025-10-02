# Backend - Woovi Challenger Bank

Modern GraphQL API built with Koa.js, MongoDB and Redis, offering complete banking system functionality with PIX, accounts and transactions support.

## 🏗️ Architecture

### Technology Stack
- **Framework**: Koa.js with TypeScript
- **API**: GraphQL with Relay
- **Database**: MongoDB with Mongoose
- **Jobs**: Redis
- **Testing**: Jest with MongoDB Memory Server
- **Build**: tsc for development

## ✅ Implemented Modules

### 1. 👤 User
**Features:**
- Data model with email and password
- GraphQL Type with Relay
- Basic authentication

### 2. 💳 Account
**Features:**
- Banking account management
- Support for individual and business accounts
- PIX key system
- Balance control

### 3. 📊 LedgerEntry (Accounting Entry)
**Features:**
- Accounting entry system
- Support for debit and credit
- Transaction tracking

**Features:**
- Background processing jobs

### 4. 💸 PixTransaction (PIX Transaction)
**Features:**
- PIX transaction system
- Automatic creation of accounting entries

**Mutations:**
- `CreatePixTransaction`: Create new PIX transaction

## 🧪 Testing

### Configuration
- **Framework**: Jest with Babel for TypeScript
- **Database**: MongoDB Memory Server
- **Mocks**: Redis mock for isolated tests

### Run Tests
```bash
#
pnpm test
```

## 🚀 Available Scripts

```bash
# Folder
cd apps/server             # Enter folder  

# Development
pnpm dev                   # Start server with hot reload

# Configuration
pnpm config:local          # Copy .env.example to .env

# Schema
pnpm schema                # Update GraphQL schema

# Seeds
pnpm seeds:accounts        # Populate database with test accounts

# Reset
pnpm reset:ledger          # Clear only ledger entries
pnpm reset:pix             # Clear only PIX transactions
pnpm reset:accounts        # Reset balance accounts
pnpm reset                 # Clear database and recreate seeds accounts
```
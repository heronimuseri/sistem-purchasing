# Sistem Purchasing API

Express.js backend API for the HO Plantation Purchasing System.

## Tech Stack
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with DrizzleORM  
- **Authentication**: Better Auth
- **Testing**: Vitest

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file from template
cp .env.example .env
# Edit .env with your PostgreSQL connection string

# Push database schema
npm run db:push

# Start development server
npm run dev
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run test` | Run tests |
| `npm run test:coverage` | Run tests with coverage |

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `BETTER_AUTH_SECRET` | Auth secret key | `your-secret-key` |
| `BETTER_AUTH_URL` | Auth server URL | `http://localhost:3001` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `PORT` | Server port | `3001` |

## API Endpoints

### Authentication
- `POST /api/auth/sign-up` - Register
- `POST /api/auth/sign-in` - Login
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Get session

### Resources
- `/api/companies` - Company management
- `/api/users` - User management
- `/api/suppliers` - Supplier management
- `/api/purchase-requests` - Purchase Request workflow
- `/api/purchase-orders` - Purchase Order workflow
- `/api/goods-receipts` - Goods Receipt (BPB)
- `/api/payments` - Payment processing
- `/api/reports` - Reporting

## Railway Deployment

This project is configured for Railway deployment:

1. Connect your GitHub repository to Railway
2. Add PostgreSQL addon in Railway
3. Set environment variables in Railway dashboard
4. Deploy!

The `railway.toml` file contains the deployment configuration.

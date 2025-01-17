# Stripe Subscription Backend

A modular Node.js backend service that handles Stripe subscriptions, webhooks, and system health monitoring. Built with Express.js and TypeScript.

## Features

- 🔐 Secure Stripe integration for subscription management
- 🎯 Different subscription tiers (Startups, Advanced, Enterprise)
- 🔄 Webhook handling for subscription events
- 💳 Customer portal integration
- 🏥 System health monitoring
- 📦 Modular architecture for maintainability

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Stripe account with API keys
- TypeScript knowledge

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd stripe-subscription-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET_KEY=your_webhook_secret_key
BASE_URL=http://localhost:3000
FALLBACK_URL=http://localhost:5173
```

## Project Structure

```
src/
  ├── config/
  │   └── config.ts           # Configuration and environment variables
  ├── controllers/
  │   ├── health.controller.ts    # Health check controller
  │   └── subscription.controller.ts   # Subscription logic
  ├── middleware/
  │   └── webhook.middleware.ts   # Webhook handling middleware
  ├── routes/
  │   ├── health.routes.ts        # Health check routes
  │   └── subscription.routes.ts   # Subscription routes
  ├── services/
  │   └── stripe.service.ts       # Stripe service integration
  ├── app.ts                  # Express app setup
  └── server.ts              # Server entry point
```

## API Endpoints

### Health Check

- `GET /` - System health status and metrics

### Subscriptions

- `GET /subscribe?tier=[tier-name]` - Create a subscription checkout session
- `GET /success?session_id=[session-id]` - Handle successful subscription
- `GET /customers/:customerId` - Access customer portal
- `POST /webhook` - Handle Stripe webhooks

## Usage

1. Start the development server:

```bash
npm run dev
```

2. Build for production:

```bash
npm run build
```

3. Start production server:

```bash
npm start
```

## Subscription Tiers

- **Startups**: Basic tier for small businesses
- **Advanced**: Enhanced features for growing companies
- **Enterprise**: Full feature set for large organizations

## Health Check Response

The health check endpoint (`GET /`) returns:

```json
{
  "uptime": 1234.5678,
  "message": "OK",
  "timestamp": 1673945678901,
  "systemInfo": {
    "platform": "linux",
    "nodeVersion": "v16.14.0",
    "memoryUsage": {
      "heapUsed": 12345678,
      "heapTotal": 23456789,
      "external": 1234567,
      "rss": 34567890
    },
    "freeMemory": 8589934592,
    "totalMemory": 17179869184,
    "cpus": 8
  }
}
```

## Webhook Events

The system handles the following Stripe webhook events:

- `checkout.session.completed` - New subscription started
- `invoice.paid` - Successful payment
- `invoice.payment_failed` - Failed payment
- `customer.subscription.updated` - Subscription changes

## Development

### Adding New Features

1. Create new controllers in `src/controllers/`
2. Add services in `src/services/` for business logic
3. Define routes in `src/routes/`
4. Update `app.ts` to include new routes

### Environment Setup

For local development:

1. Install the Stripe CLI
2. Forward webhooks to local environment:

```bash
stripe listen --forward-to localhost:3000/webhook
```

## Error Handling

The application includes:

- Webhook signature verification
- Try-catch blocks for API calls
- Error status codes and messages
- Subscription tier validation

## Security

- CORS configuration for frontend access
- Webhook signature verification
- Environment variable protection
- Request validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request


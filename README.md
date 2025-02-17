# Node.js Billing Service

A robust billing service implementation using Express.js and Stripe for handling subscriptions, payments, and customer management.

## Features

- Subscription management with multiple tiers (Starter, Startup, Advanced, Enterprise)
- Secure payment processing via Stripe Checkout
- Customer portal integration for subscription management
- Webhook handling for Stripe events
- Session management and tracking
- Subscription cancellation
- Detailed subscription status retrieval

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Stripe account with API keys

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/billing-service.git
cd billing-service
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET_KEY=your_webhook_secret
BASE_URL=http://localhost:3000
FALLBACK_URL=http://localhost:3000/billing
```

## Configuration

The service uses a configuration module (`config.ts`) to manage environment variables and Stripe-specific settings. You'll need to configure:

- Stripe API keys
- Webhook secrets
- Base URL for redirects
- Subscription tier pricing IDs

### Subscription Tiers

The service supports multiple subscription tiers with corresponding Stripe price IDs:

- Starter
- Startup
- Advanced
- Enterprise

Configure your price IDs in the `config.ts` file.

## API Endpoints

### Subscription Management

```
GET /subscribe?tier=<tier_name>
- Creates a new subscription checkout session
- Required query parameter: tier (starter|startup|advanced|enterprise)
- Returns: session ID and checkout URL

GET /success?session_id=<session_id>
- Handles successful subscription checkout
- Redirects to customer portal

GET /customers/:customerId
- Retrieves customer portal session
- Redirects to Stripe customer portal

DELETE /subscriptions/:subscriptionId
- Cancels an active subscription
- Returns: canceled subscription details

GET /subscriptions/session/:sessionId
- Retrieves subscription details for a session
- Returns: subscription status and details

POST /webhook
- Handles Stripe webhook events
- Requires raw body parsing
```

## Usage Examples

### Creating a New Subscription

```typescript
const response = await fetch('/subscribe?tier=starter');
const { url } = await response.json();
window.location.href = url;
```

### Canceling a Subscription

```typescript
const response = await fetch(`/subscriptions/${subscriptionId}`, {
  method: 'DELETE'
});
const canceledSubscription = await response.json();
```

### Checking Subscription Status

```typescript
const response = await fetch(`/subscriptions/session/${sessionId}`);
const subscriptionDetails = await response.json();
```

## Security

The service implements several security measures:

- Webhook signature verification
- Environment variable protection
- Stripe session handling
- Raw body parsing for webhooks

## Error Handling

The service includes comprehensive error handling for:

- Invalid subscription tiers
- Failed payment processing
- Invalid session IDs
- Webhook verification failures
- Customer portal access issues

## Development

To run the service locally:

```bash
npm run dev
```

For production:

```bash
npm run build
npm start
```
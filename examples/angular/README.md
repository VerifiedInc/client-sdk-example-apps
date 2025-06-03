# Verified.inc Client SDK - Angular Example App

## Overview

This project demonstrates the integration of the [Verified.inc Client SDK](https://docs.verified.inc/sdk-reference/installation) into an Angular application. It provides a practical reference implementation that developers can use as a guide when incorporating the Verified.inc identity verification capabilities into their own Angular applications.

## Quick Start

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/VerifiedInc/client-sdk-example-apps.git
   cd client-sdk-example-apps/examples/angular
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run start
   ```

4. Open your browser and navigate to `http://localhost:4200`

## Project Structure

```
src/
├── app/
│   ├── verified-sdk/              # SDK wrapper component
│   │   ├── verified-sdk.component.ts
│   │   └── verified-sdk.component.html
│   ├── app.component.ts           # Main application component
│   ├── app.component.html         # App template showing SDK integration
│   └── app.config.ts              # Angular application configuration
└── main.ts                        # Application entry point
```

## Additional Resources

- [Verified.inc Documentation](https://docs.verified.inc/)
- [Client SDK Reference](https://docs.verified.inc/sdk-reference/installation)

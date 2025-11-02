# Plumbit - Your Trusted Plumber, On-Demand

A marketplace connecting customers with certified plumbers for on-demand or scheduled jobs, with direct, offline payments.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/DCFwizard/plumbit-your-trusted-plumber-on-demand)

## Overview

Plumbit is a proof-of-concept marketplace connecting customers with certified plumbers. It operates similarly to food delivery platforms but is tailored for home services, focusing on job matching, status tracking, and communication. The MVP intentionally omits in-app payments; customers pay plumbers directly via cash or other offline methods.

The platform consists of four key components: a public-facing marketing website, a customer portal, a plumber portal, and an administrative portal.

## Key Features

-   **Public Website:** A comprehensive marketing site with pages for home, services, how it works, plumber recruitment, and more.
-   **Customer Portal:** A secure area for customers to request new jobs, track their status, view job history, and leave reviews.
-   **Plumber Portal:** A dedicated portal for plumbers to manage their profile, view and accept available jobs, and update job statuses.
-   **Admin Portal:** A powerful backend interface for administrators to manage users, plumbers, jobs, and reviews.

## Technology Stack

-   **Frontend:** React, Vite, TypeScript, React Router, Tailwind CSS
-   **UI Components:** shadcn/ui, Lucide React, Framer Motion
-   **State Management:** Zustand
-   **Backend:** Hono on Cloudflare Workers
-   **Database:** Cloudflare Durable Objects (using a single-instance, multi-entity pattern)
-   **Form Handling:** React Hook Form with Zod for validation

## Project Structure

The project is organized into three main directories to ensure a clean separation of concerns:

-   `src/`: Contains the React frontend application, including pages, components, hooks, and utility functions.
-   `worker/`: Contains the Hono backend API that runs on Cloudflare Workers. This includes route definitions, entity logic, and core Durable Object utilities.
-   `shared/`: Contains shared TypeScript types and mock data used by both the frontend and backend to ensure end-to-end type safety.

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) for interacting with the Cloudflare platform. You can install it by running `bun install -g wrangler`.
-   A Cloudflare account.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd plumbit
    ```

2.  **Install dependencies:**
    This project uses Bun for package management.
    ```bash
    bun install
    ```

### Running in Development Mode

To start the local development server, which includes the Vite frontend and a local `workerd` instance for the backend API, run:

```bash
bun run dev
```

This will start the application, typically on `http://localhost:3000`. The frontend will hot-reload on changes, and the worker will restart automatically.

## Available Scripts

-   `bun run dev`: Starts the local development server.
-   `bun run build`: Builds the frontend application for production.
-   `bun run deploy`: Deploys the application to your Cloudflare account.
-   `bun run lint`: Lints the codebase to check for errors and style issues.

## Deployment

This application is designed to be deployed to Cloudflare Pages for the frontend and Cloudflare Workers for the backend.

1.  **Login to Wrangler:**
    Authenticate the Wrangler CLI with your Cloudflare account.
    ```bash
    wrangler login
    ```

2.  **Deploy the application:**
    The `deploy` script handles building the application and deploying it.
    ```bash
    bun run deploy
    ```

Alternatively, you can deploy directly from your GitHub repository using the button below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/DCFwizard/plumbit-your-trusted-plumber-on-demand)

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
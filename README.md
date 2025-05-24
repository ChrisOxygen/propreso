# Propreso - AI-Powered Proposal Generator for Freelancers

![Propreso Logo](public/static/site-icon-white.svg)

Propreso is a modern web application that helps freelancers create winning proposals in seconds using AI technology. The platform enables freelancers to craft personalized, professional proposals for platforms like Upwork, Fiverr, and other freelance marketplaces.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [Email Templates](#email-templates)
- [Contributing](#contributing)
- [License](#license)

## Features

- **AI-Generated Proposals**: Create targeted, professional responses in seconds using AI
- **Personalized Dashboard**: Track proposal outcomes and performance metrics
- **Chrome Extension**: Import jobs directly from Upwork and generate proposals without leaving the page
- **Multiple Proposal Formulas**: Choose from proven frameworks like AIDA, PAS, BAB, STAR, and FAB
- **Customizable Tone**: Select between professional and friendly tones
- **Professional Profile Builder**: Create a comprehensive profile with AI assistance
- **Social Authentication**: Sign in with Google, GitHub, or email/password
- **Email Verification**: Secure account verification process
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technologies

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth v5
- **Email**: React Email for templates, Resend for delivery
- **State Management**: React Query
- **Form Handling**: React Hook Form with Zod validation
- **AI Integration**: OpenAI API
- **UI Components**: Radix UI with custom styling

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- MongoDB database
- OpenAI API key
- Resend API key (for emails)
- Google and GitHub OAuth credentials (optional)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/propreso.git
   cd propreso
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

   ```
   # Database
   DATABASE_URL=your_mongodb_connection_string

   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret

   # OAuth Providers (Optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret

   # OpenAI
   RAPID_API_KEY=your_rapid_api_key

   # Email (Resend)
   RESEND_API_KEY=your_resend_api_key
   ```

4. Set up the database:

   ```bash
   npx prisma generate
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
propreso/
├── app/                   # Next.js app router
│   ├── (authentication)   # Authentication routes
│   ├── (main)            # Main app routes
│   ├── api/               # API routes
├── components/            # Shared UI components
├── constants/             # Application constants
├── features/              # Feature-based organization
│   ├── Home/              # Home page components
│   ├── profiles/          # Profile-related features
│   ├── proposals/         # Proposal-related features
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── prisma/                # Prisma schema and migrations
├── providers/             # React context providers
├── public/                # Static assets
├── react-email-starter/   # Email templates
│   ├── emails/            # React Email components
├── types/                 # TypeScript type definitions
```

## Environment Variables

| Variable               | Description                  |
| ---------------------- | ---------------------------- |
| `DATABASE_URL`         | MongoDB connection string    |
| `NEXTAUTH_URL`         | URL of your application      |
| `NEXTAUTH_SECRET`      | Secret for NextAuth sessions |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID       |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret   |
| `GITHUB_CLIENT_ID`     | GitHub OAuth client ID       |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret   |
| `RAPID_API_KEY`        | API key for OpenAI service   |
| `RESEND_API_KEY`       | API key for email service    |

## Authentication

Propreso uses NextAuth.js for authentication with the following providers:

- Email/Password (Credentials)
- Google
- GitHub

For social authentication, users need to confirm their account by email verification.

## Email Templates

Email templates are built using React Email, located in the `react-email-starter/emails/` directory:

- `WelcomeEmail.tsx`: Sent to users after signing up
- `VerifyEmail.tsx`: Sent for account verification

To preview email templates during development:

```bash
cd react-email-starter
npm run dev
```

## Contributing

We welcome contributions to Propreso! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please ensure your code follows the project's style guidelines and includes appropriate tests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

© 2025 Propreso. All rights reserved.

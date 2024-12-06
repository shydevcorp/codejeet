# codejeet.xyz

🧑🏻‍💻 8,000+ company-wise, topic-wise LeetCode questions with text solutions and video explanations. FOR FREE.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**:
  - [shadcn/ui](https://ui.shadcn.com/)
  - [Framer Motion](https://www.framer.com/motion/)
- **AI Integration**: [Google Gemini](https://gemini.google.com/)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)

## Run Locally

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [yarn](https://yarnpkg.com/)

Clone the project

```bash
  git clone https://github.com/ayush-that/codejeet
```

Go to the project directory

```bash
  cd codejeet
```

Install dependencies

```bash
  yarn install
```

Copy .env (Make sure to change env vars in this file)

```bash
  cp .env.example .env
```

Start the dev server

```bash
  yarn dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

`CLERK_SECRET_KEY`

`GEMINI_API_KEY` (Optional)

## License

[GPL 3.0](https://choosealicense.com/licenses/gpl-3.0/)

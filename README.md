<div align="center">
<h1>Generative UI: GitHub Assistant</h1>
  <a href="https://githubassistant.vercel.app">
<img width="1255" src="https://github.com/kayaayberk/generative-ui-github-assistant/assets/136496255/014163f3-2ba8-403f-9802-25c52b3273a7">
  </a>
  <p align="center">
Github Assistant is a chatbot that utilises GPT and Vercel AI SDK to generate UI elements on the fly based on user input by calling functions and APIs. It queries the user input and responds with interactive UI elements within the AI stream to make the experience of a developer a lot smoother.
<br />

<a href="https://githubassistant.vercel.app">View LIVE</a>

  </p>
</div>
<br />
  <p align="center">
<b>NOTE: Actions related to GitHub without tight rate limits require authentication. Testing the app with a session is recommended.</b>
  </p>

## 🔍 Overview

- 📖 [Walk-through](#walk-through)
- ⚙️ [Run on local](#run-on-local)
- 🧱 [Tech Stack & Features](#tech-stack-&-features)

## 📖 Walk-through
<b><p>NOTE: Please beware that the search queries are conducted by the LLM (GPT-3-turbo) so sometimes it might bring out unexpected results.</p></b>

<b>Username search</b> ~ Brings out the related profile UI component with related information and actions.
> Example: `Search for the username 'kayaayberk'`

<b>Search list of users</b> ~ Brings out the people who appeared in the search conducted by the LLM presented in a UI component with different actions.
> Example: `Search for the people named John with more than 5 repositories located in London.`

<b>Repository search</b> ~ Brings out the first 4 repositories that appeared in the search with related actions presented in a UI component.
> Example: `Search for the repositories that have 'state management' in description with more than 5.000 stars.`

<b>Directory content search</b> ~ Brings out the searched repository directory with its content on each file.
> Example: `Search for ReduxJs/redux content directory.`

<b>Readme search</b> ~ Brings out the full README.md of a searched repository in an organised format.
> Example: `Search for the readme of Shadcn/ui`

<p>
You can also interact with these actions within the AI stream through presented UI components. Each component includes related actions.
</p>

### Actions & Function calling
Actions and functions related to generative UI elements as well as the AI provider can be found in:
- `/lib/chat/actions.tsx`
- `/lib/chat/submit-user-action.tsx` 
- `/lib/chat/submit-user-message.tsx`

## ⚙️ Run on your local

#### 1. Clone the repository
```bash
git clone https://github.com/kayaayberk/generative-ui-github-assistant.git
```

#### 2. Install dependencies & run on localhost
```bash
cd generative-ui-github-assistant
npm install
npm run dev
```

#### 3. Set up .env.local

```bash
OPENAI_API_KEY=[YOUR_OPENAI_API_KEY]

## Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[YOUR_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY]
NEXT_PUBLIC_CLERK_SIGN_IN_URL=[PREFERRED_URL]
NEXT_PUBLIC_CLERK_SIGN_UP_URL=[PREFERRED_URL]
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=[PREFERRED_URL]
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=[PREFERRED_URL]

## Neon Database
DATABASE_URL=[YOUR_NEON_DATABASE_URL]

## GitHub OAuth app
GITHUB_CLIENT_ID=[YOUR_GITHUB_CLIENT_ID]
GITHUB_CLIENT_SECRET=[YOUR_GITHUB_CLIENT_SECRET]
```

## 🧱 Stack & Features

#### Frameworks & Libraries & Languages

- [React](https://react.dev/)
- [Next.js](https://nextjs.org/)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Typescript](https://www.typescriptlang.org/docs/)
- [Zod](https://github.com/colinhacks/zod)
- [Clerk Auth](https://clerk.com/docs)

#### Platforms

- [OpenAI](https://platform.openai.com/docs/introduction)
- [Neon Database](https://neon.tech/)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [Vercel](https://www.contentful.com/)
- [GitHub API](https://docs.github.com/en/rest?apiVersion=2022-11-28)

#### UI

- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Phosphor Icons](https://phosphoricons.com/)

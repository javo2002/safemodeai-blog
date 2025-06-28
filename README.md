# safemodeai-blog

# SafemodeAI Blog

SafemodeAI Blog is a full-stack blogging platform built with Next.js, Supabase, and Tailwind CSS. It provides a complete solution for creating, managing, and displaying blog posts with user authentication and role-based access control.

## ✨ Features

  * **Full-stack application** built with Next.js App Router.
  * **Supabase** for database and authentication.
  * **Styling** with Tailwind CSS and shadcn/ui.
  * **Rich text editor** for creating and editing posts.
  * **Role-based access control** with 'author' and 'super-admin' roles.
  * **Server Actions** for all backend operations.
  * **Deployment-ready** for Netlify.

## 🚀 Getting Started

### Prerequisites

  * Node.js (v18.17.0 or later)
  * pnpm

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/javo2002/safemodeai-blog.git
    cd safemodeai-blog/safemode-ai-blog
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up your environment variables:**

    Create a `.env.local` file in the `safemode-ai-blog` directory and add the following Supabase credentials:

    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
    SESSION_SECRET=your-session-secret
    ```

4.  **Set up the database:**

    Run the SQL scripts in the `scripts` directory in your Supabase SQL editor to create the necessary tables and seed initial data.

      * `01-create-tables.sql`
      * `02-seed-data.sql`

5.  **Run the development server:**

    ```bash
    pnpm dev
    ```

    Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser to see the result.

## 🛠️ Scripts

  * `pnpm dev`: Starts the development server.
  * `pnpm build`: Creates a production build.
  * `pnpm start`: Starts the production server.
  * `pnpm lint`: Lints the code.

## ⚙️ Tech Stack

  * **Framework:** [Next.js](https://nextjs.org/)
  * **Styling:** [Tailwind CSS](https://tailwindcss.com/)
  * **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
  * **Database & Auth:** [Supabase](https://supabase.com/)
  * **Rich Text Editor:** [Tiptap](https://tiptap.dev/)
  * **Deployment:** [Netlify](https://www.netlify.com/)

## 📁 Project Structure

```
.
├── app/                  # Main application code (App Router)
│   ├── (admin)/          # Admin routes
│   ├── (auth)/           # Authentication routes
│   ├── articles/         # All articles page
│   ├── posts/            # Individual post pages
│   ├── about/            # About page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/           # React components
│   ├── ui/               # UI components from shadcn/ui
│   └── ...
├── lib/                  # Library files
│   ├── supabase/         # Supabase client and server setup
│   └── utils.ts          # Utility functions
├── public/               # Public assets
├── scripts/              # SQL scripts for database setup
└── ...
```

## 📄 License

This project is licensed under the MIT License.

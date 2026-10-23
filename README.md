# Reddit clone

A full-stack Reddit-style forum where users create communities, post, comment in threads, and vote. A SvelteKit frontend and a Deno REST API backend with PostgreSQL.

**Try it out:** https://fullstack-reddit-clone-794.pages.dev/

![Screenshot of the app](docs/post.png)

## Background

This started as the term project for a full-stack web development course (spring 2026). After the course ended I kept working on it. Since then I have fixed bugs, added usernames and voting, changed how the client and server stay in sync, and deployed it so it runs online rather than only locally.

I had two goals: turn a course assignment into something a person can actually use, and learn the things the course did not cover, such as hosting a multi-service app for free and debugging it in production.

## What it does

- Register and log in. Passwords are hashed with scrypt; sessions are stateless JWTs sent as Bearer tokens.
- Create communities, then create and delete posts inside them.
- Comment on posts and vote posts and comments up or down. Each user gets one vote per item, and clicking the same arrow again removes the vote.
- A homepage that shows recent posts, each showing its community, author, score, and comment count.

## Tech stack

| Layer | Choice |
|-------|--------|
| Frontend | SvelteKit & Tailwind |
| API | Deno + Hono |
| Database | PostgreSQL |
| Migrations | Flyway |
| Tests | Playwright |
| Local dev | Docker Compose |
| Hosting | Neon, Deno Deploy, Cloudflare Pages |

## Architecture

Three services talk to each other over HTTP and SQL:

```mermaid
flowchart LR
  Browser["SvelteKit SPA<br/>(Cloudflare Pages)"] -->|HTTP / JSON| API["Hono REST API<br/>(Deno Deploy)"]
  API -->|SQL| DB[("PostgreSQL<br/>(Neon)")]
```

The API is layered. Routes map to controllers, which handle the request and call repositories, which hold the SQL. Nothing above the repository layer writes queries, so the data access stays in one place.

A couple of schema decisions worth pointing out:

- **Comments are posts.** A comment is a row in the `posts` table with a `parent_post_id` pointing at the post it belongs to. One self-referential table instead of two.
- **A vote is a row** in a `votes` table keyed by `(user_id, post_id)`, with a unique constraint so a user can vote once per item. Deleting a post cascades to its comments and votes.

Authentication is stateless. You log in, get a signed token, and every protected request carries it. The server verifies the signature and keeps no session of its own. Public reads (the homepage, a post) still read your token when it is present, so the API can tell you which way you voted without requiring login to view anything.

## Concepts demonstrated

REST API design, layered architecture, repository pattern, CRUD, relational schema design with a normalized self-referential table, database migrations, parameterized queries (safe against SQL injection), JWT authentication with hashed passwords, end-to-end testing, containerized local development, and push-to-deploy hosting.

## Running locally

You need Docker.

```bash
docker compose up
```

That starts the frontend on `http://localhost:5173`, the API on `http://localhost:8000`, a PostgreSQL container, and the Flyway migrations, which run automatically.

To fill the database with demo content (communities, posts, comments, votes, and a demo user), run the seed script inside the server container:

```bash
docker compose exec server deno run --allow-env --allow-net seed.ts
```

## Testing

Playwright end-to-end tests run against the full stack and cover the core flows: authentication, creating and deleting communities, post creation, voting, and removal, and the same for comments.

```bash
cd e2e-tests && npx playwright test
```


## Possible improvements

- Run the Playwright tests in CI on every push.
- Add role-based access control so community owners can moderate posts and comments, not just their own.

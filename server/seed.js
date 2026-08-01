// Seed the database with demo content so the deployed portfolio piece isn't empty.

// For Neon:
//   DATABASE_URL="postgresql://...:...@...-pooler.../db?sslmode=require" \
//     deno run --allow-env --allow-net seed.js

// For local Docker: deno run --allow-env --allow-net seed.js

import { hash } from "scrypt";
import sql from "./database.js";

const DEMO_PASSWORD = "password123";

const users = [
  { email: "demo@example.com" },
  { email: "ada@example.com" },
  { email: "linus@example.com" },
  { email: "grace@example.com" },
  { email: "alan@example.com" },
];

const communities = [
  {
    name: "About this website",
    description: "A bit about how this came to be",
    posts: [
      {
        title: "The backbone",
        content:
          "The backbone of this website is the overarching project of a full-stack web development course I attended in spring 2026. This website is built with the tools and principles covered.\n\n" +
          "It's a Reddit clone. You can create communities, write posts, leave comments, and vote things up or down. Everything here is seed data, but the site actually works. Register an account (or use the demo login) and try it.\n\n" +
          "The posts below recap the stack, how it fits together, and what I got out of building it.",
        comments: [
          "Meta note: the comment you're reading is itself a row in the database. Comments are just posts with a parent. More on that further down.",
          "All of this is seed data, but nothing here is faked. Register and you can post your own.",
        ],
      },
      {
        title: "The stack",
        content:
          "What the site is built with, and roughly why.\n\n" +
          "The frontend is SvelteKit (Svelte 5), running as a single-page app and styled with Tailwind CSS v4. Svelte's runes ($state, $derived, $effect) handle the reactivity.\n\n" +
          "The backend is a REST API written in Deno with the Hono framework. Passwords are hashed with scrypt, and login sessions are signed JWTs.\n\n" +
          "The database is PostgreSQL, queried with the postgres.js library. Schema changes are versioned with Flyway migrations.\n\n" +
          "For testing there are end-to-end tests with Playwright, and the whole stack boots locally with a single `docker compose up`. (Not very thorough, just enough to get the hang of E2E testing.)",
        comments: [
          "Deno was the newest for me: it runs TypeScript directly and pulls dependencies from an import map instead of a node_modules folder.",
          "Hono is tiny and fast, and the same app object runs locally and when deployed.",
        ],
      },
      {
        title: "How it's put together",
        content:
          "It's three independent services wired together:\n\n" +
          "1. The SvelteKit client (the pages you're looking at) fetches everything from the API over HTTP.\n" +
          "2. The Hono API handles login and all the reading and writing of communities, posts, comments and votes.\n" +
          "3. PostgreSQL stores it all.\n\n" +
          "Two design details I liked:\n\n" +
          "- Comments are just posts with a parent_post_id pointing at the post they belong to. One table, referencing itself.\n" +
          "- A vote is a row in a votes table keyed by (user_id, post_id), so each person gets exactly one vote per item.\n\n" +
          "Auth is stateless: you log in, get a signed token, and every protected request carries it as a Bearer token. The server keeps no session of its own.",
        comments: [
          "Storing posts and comments in one table keeps the schema small, but it also means that a post and a comment are the same thing underneath.",
          "Because the token is signed, the API only has to verify its signature on each request. There's no session to look up.",
        ],
      },
      {
        title: "Getting it online for free",
        content:
          "A portfolio piece has to be online, and I didn't want to pay. Here's how I did it, in STAR form, of course.\n\n" +
          "Situation: the project runs locally in Docker, but locally-only doesn't help anyone see it.\n\n" +
          "Task: host a three-service full-stack app (client, API, database) for free.\n\n" +
          "Action: I split the services across three free tiers. The database runs on Neon, the Deno API on Deno Deploy, and the static SvelteKit frontend on Cloudflare Pages.\n\n" +
          "Result: the site is live, auto-deploys on every push to the main branch, and costs nothing.",
        comments: [
          "One push to the main branch rebuilds the frontend and redeploys the API at the same time.",
        ],
      },
      {
        title: "What I learned",
        content:
          "This project taught me a few things:\n\n" +
          "- Full-stack thinking: following a single click from the browser, through the API, into the database and back.\n" +
          "- Designing a REST API and a relational schema.\n" +
          "- Doing authentication: passwords, JWTs, and routes.\n" +
          "- Treating SQL as a real skill, since a lot of the logic is in the queries.\n" +
          "- Debugging on the live site: a crash from unhandled empty state, a wrong-shaped API response, and a couple of display bugs.\n" +
          "Thanks for reading. Take a look around and vote however you like.",
        comments: [
        ],
      },
    ],
  },
  {
    name: "feedback",
    description: "Spotted a bug or have a suggestion? Post it here.",
    posts: [
      {
        title: "Leave feedback here",
        content:
          "This is a portfolio project, so I'm genuinely happy to hear what could be better. Register an account and drop a post. It'll show up right here.\n\n" +
          "The demo data resets whenever the site is reseeded, so anything posted may disappear later.",
        comments: [],
      },
    ],
  },
];

console.log("Clearing existing data...");
await sql`TRUNCATE votes, posts, communities, users RESTART IDENTITY CASCADE`;

console.log("Creating users...");
const passwordHash = hash(DEMO_PASSWORD);
const userRows = [];
for (const user of users) {
  const [row] = await sql`
    INSERT INTO users (email, password_hash)
    VALUES (${user.email}, ${passwordHash})
    RETURNING id`;
  userRows.push(row);
}
const authorId = userRows[0].id;

console.log("Creating communities, posts, comments and votes...");
let postCount = 0;
let commentCount = 0;
let voteCount = 0;

for (const community of communities) {
  const [communityRow] = await sql`
    INSERT INTO communities (name, description, created_by)
    VALUES (${community.name}, ${community.description}, ${authorId})
    RETURNING id`;

  for (const post of community.posts) {
    const [postRow] = await sql`
      INSERT INTO posts (community_id, title, content, created_by)
      VALUES (${communityRow.id}, ${post.title}, ${post.content}, ${authorId})
      RETURNING id`;
    postCount++;

    // A few upvotes from distinct users so vote counts look alive.
    const upvoters = userRows.slice(0, 2 + Math.floor(Math.random() * (userRows.length - 1)));
    for (const voter of upvoters) {
      await sql`
        INSERT INTO votes (user_id, post_id, vote)
        VALUES (${voter.id}, ${postRow.id}, 'upvote')
        ON CONFLICT (user_id, post_id) DO NOTHING`;
      voteCount++;
    }

    for (const comment of post.comments) {
      await sql`
        INSERT INTO posts (community_id, content, parent_post_id, created_by)
        VALUES (${communityRow.id}, ${comment}, ${postRow.id}, ${authorId})`;
      commentCount++;
    }
  }
}

console.log(
  `Done. ${userRows.length} users, ${communities.length} communities, ` +
    `${postCount} posts, ${commentCount} comments, ${voteCount} votes.`,
);
console.log(`Demo login: demo@example.com / ${DEMO_PASSWORD}`);

await sql.end();

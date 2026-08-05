// Seed the database with demo content so the deployed portfolio piece isn't empty.

// For Neon:
//   cd server
//   DATABASE_URL="(password)" deno run --allow-env --allow-net seed.js

// For local Docker: deno run --allow-env --allow-net seed.js

import { hash } from "scrypt";
import sql from "./database.js";

const DEMO_PASSWORD = "password123";

const users = [
  { email: "vikke@example.com", username: "Vikke" },
  { email: "demo@example.com", username: "Demo" },
  { email: "linus@example.com", username: "linus" },
  { email: "grace@example.com", username: "grace" },
  { email: "alan@example.com", username: "alan" },
];

const communities = [
  {
    name: "About this website",
    description: "What this is and how it was built",
    posts: [
      {
        title: "What this is",
        content:
          "A full-stack Reddit clone. I built it for a web dev course in spring 2026, then kept going until it actually held together and went online.\n\n" +
          "What you can do here: make communities, post, comment, and vote things up or down.\n\n" +
          "It's all seed data, but the site is real. Register or use the demo login and try it.\n\n" +
          "The posts below are the quick tour: the stack, how it's built, how it's hosted, and what I got out of it.",
        comments: [
          "Worth knowing: this comment is a row in the same table as the posts. A comment is just a post with a parent. More on that in the build post.",
        ],
      },
      {
        title: "The stack",
        content:
          "The short version:\n\n" +
          "Frontend: SvelteKit (Svelte 5) as a single-page app, Tailwind v4 for styling. Reactivity uses Svelte's runes.\n" +
          "Backend: a REST API in Deno with Hono. Passwords hashed with scrypt, sessions are signed JWTs.\n" +
          "Database: PostgreSQL through postgres.js, schema changes versioned with Flyway.\n" +
          "Tests: end-to-end with Playwright, light coverage, mostly to learn how E2E works.\n" +
          "Local dev: docker compose up boots the whole thing.",
        comments: [
          "Deno was the new one for me. It runs TypeScript directly and pulls dependencies from an import map, so there is no node_modules folder.",
        ],
      },
      {
        title: "How it's built",
        content:
          "Three services talking to each other:\n\n" +
          "1. SvelteKit client: the pages you're on. It fetches everything from the API.\n" +
          "2. Hono API: login, plus reading and writing communities, posts, comments, and votes.\n" +
          "3. PostgreSQL: stores all of it.\n\n" +
          "Two design bits I like:\n\n" +
          "Comments are posts. A comment is a row in the posts table with a parent_post_id pointing at its parent. One table, referencing itself.\n\n" +
          "One vote per person per item. A vote is a row in a votes table keyed by (user_id, post_id), so the database enforces it.\n\n" +
          "Auth is stateless: log in, get a signed token, send it with each request. The server checks the signature and keeps no session of its own.",
        comments: [
          "Keeping posts and comments in one table means a post and a comment are the same shape underneath, which kept the code smaller.",
        ],
      },
      {
        title: "How it's hosted (for free)",
        content:
          "I wanted it online without paying, so each service runs on its own free tier:\n\n" +
          "Database: Neon.\n" +
          "API: Deno Deploy.\n" +
          "Frontend: Cloudflare Pages.\n\n" +
          "Every push to the main branch rebuilds the frontend and redeploys the API, so it stays live and costs nothing.",
        comments: [],
      },
      {
        title: "What I got out of it",
        content:
          "The main things this taught me:\n\n" +
          "- Following one click the whole way: browser to API to database and back.\n" +
          "- Designing a REST API and a relational schema.\n" +
          "- Real authentication: password hashing, JWTs, protected routes.\n" +
          "- Taking SQL seriously, since a lot of the logic lives in the queries.\n" +
          "- Debugging in production: an empty-state crash, an API response shaped wrong, and a few display bugs.\n\n" +
          "That's the tour. Have a look around and vote however you want.",
        comments: [],
      },
    ],
  },
  {
    name: "feedback",
    description: "Found a bug or have a suggestion? Post it here.",
    posts: [
      {
        title: "Leave feedback here",
        content:
          "It's a portfolio project, so I actually want to know what could be better. Register and drop a post, and it shows up right here.\n\n" +
          "Heads up: the demo data resets when the site is reseeded, so posts may disappear later.",
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
    INSERT INTO users (email, password_hash, username)
    VALUES (${user.email}, ${passwordHash}, ${user.username})
    RETURNING id`;
  userRows.push(row);
}
const authorId = userRows[0].id;

console.log("Creating communities, posts, comments and votes...");
let postCount = 0;
let commentCount = 0;
let voteCount = 0;
// Posts are stamped a minute apart, so the first post is the newest. 
// Both the homepage and the community list sort newest first.
let postSeq = 0;

for (const community of communities) {
  const [communityRow] = await sql`
    INSERT INTO communities (name, description, created_by)
    VALUES (${community.name}, ${community.description}, ${authorId})
    RETURNING id`;

  for (const post of community.posts) {
    const [postRow] = await sql`
      INSERT INTO posts (community_id, title, content, created_by, created_at)
      VALUES (${communityRow.id}, ${post.title}, ${post.content}, ${authorId},
              NOW() - ${postSeq} * INTERVAL '1 minute')
      RETURNING id`;
    postCount++;
    postSeq++;

    // A few upvotes from other users
    const upvoters = userRows.slice(0, 2 + Math.floor(Math.random() * (userRows.length - 1)));
    for (const voter of upvoters) {
      await sql`
        INSERT INTO votes (user_id, post_id, vote)
        VALUES (${voter.id}, ${postRow.id}, 'upvote')
        ON CONFLICT (user_id, post_id) DO NOTHING`;
      voteCount++;
    }

    for (const comment of post.comments) {
      // Cycle through the non-owner users
      const commentAuthor = userRows[1 + (commentCount % (userRows.length - 1))];
      await sql`
        INSERT INTO posts (community_id, content, parent_post_id, created_by)
        VALUES (${communityRow.id}, ${comment}, ${postRow.id}, ${commentAuthor.id})`;
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

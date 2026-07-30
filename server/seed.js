// Seed the database with demo content so the deployed portfolio piece isn't empty.
//
// Run against Neon:
//   DATABASE_URL="postgresql://...:...@...-pooler.../db?sslmode=require" \
//     deno run --allow-env --allow-net seed.js
//
// Run against local Docker (uses PG* env vars, no DATABASE_URL):
//   deno run --allow-env --allow-net seed.js
//
// It is idempotent: it truncates the demo tables first, then reinserts.
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
    name: "webdev",
    description: "Everything about building for the web.",
    posts: [
      {
        title: "What did you ship this week?",
        content:
          "Just deployed my first full-stack app to production. Deno + Hono on the backend, SvelteKit on the front. What's everyone else building?",
        comments: [
          "Congrats! Deno Deploy or self-hosted?",
          "Svelte is such a joy after years of React honestly.",
        ],
      },
      {
        title: "Tailwind v4 first impressions",
        content:
          "The new engine is fast and the config-less setup is refreshing. Anyone hit migration pain points coming from v3?",
        comments: ["The CSS-first config took me a minute but I love it now."],
      },
    ],
  },
  {
    name: "programming",
    description: "News and discussion for developers of all stripes.",
    posts: [
      {
        title: "Underrated CLI tools you can't live without?",
        content:
          "Mine are ripgrep, fzf, and jq. Curious what small tools have quietly changed the way you work.",
        comments: [
          "fd + fzf is a life changer for navigating big repos.",
          "bat instead of cat, never going back.",
        ],
      },
      {
        title: "Is SQL a skill worth investing in for frontend devs?",
        content:
          "Short answer: yes. Understanding the database has made me a dramatically better engineer. Long answer inside.",
        comments: [],
      },
    ],
  },
  {
    name: "askreddit",
    description: "Ask the community anything.",
    posts: [
      {
        title: "What's a small habit that improved your life more than expected?",
        content:
          "For me it was writing down three things at the end of each workday. Keeps me from feeling like nothing got done.",
        comments: ["Making my bed. Sounds cliché but it works.", "Walking without my phone."],
      },
    ],
  },
  {
    name: "portfolio",
    description: "Show off what you've built.",
    posts: [
      {
        title: "Built a Reddit clone for my web software development course",
        content:
          "Full-stack: SvelteKit, Deno, Hono, PostgreSQL, Tailwind and Skeleton. Deployed for free on Deno Deploy, Cloudflare Pages and Neon. Feedback welcome!",
        comments: ["Clean work. The voting feels snappy.", "Nice stack choice."],
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

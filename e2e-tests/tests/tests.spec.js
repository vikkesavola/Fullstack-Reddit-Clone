import { test, expect, Page } from '@playwright/test';

async function login(page) {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('user@user.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('secret');
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Register' }).click();
  const loginButton = page.getByRole('button', { name: 'Login' });
  await expect(loginButton).toBeVisible({ timeout: 10000 });
  await loginButton.click();
  await expect(page.getByRole('link', { name: 'Go to communities' })).toBeVisible({ timeout: 2000});
};

async function createCommunity(page) {
  await page.getByRole('link', { name: 'Go to communities' }).click();
  await page.getByPlaceholder('Community Name').click();
  await page.getByPlaceholder('Community Name').fill('test community');
  await page.getByPlaceholder('Community Description').click();
  await page.getByPlaceholder('Community Description').fill('test community description');
  await page.getByRole('button', { name: 'Add Community' }).click();
};

async function createPost(page) {
  await page.getByPlaceholder('Post title').click();
  await page.getByPlaceholder('Post title').fill('test post');
  await page.getByRole('textbox', { name: 'Post content' }).click();
  await page.getByRole('textbox', { name: 'Post content' }).fill('test post content');
  await page.getByRole('button', { name: 'Add post' }).click();
};

async function createComment(page) {
  await page.getByPlaceholder('Comment content').click();
  await page.getByPlaceholder('Comment content').fill('test comment');
  await page.getByRole('button', { name: 'Add comment' }).click();
};

test.beforeEach(async ({ page }) => {
  await login(page)
});

test('Logout button shown', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
});

test('Community creation works', async ({ page }) => {
  await createCommunity(page);
  await expect(page.getByRole('link', { name: 'test community' })).toBeVisible();
});

test('Community removal works', async ({ page }) => {
  await createCommunity(page);
  const communityItem = page.getByText('test community test community');
  await page.getByRole('listitem').filter({ hasText: 'test community test community' }).getByRole('button').click();
  await expect(communityItem).not.toBeVisible();
});

test('Post creation works', async ({ page }) => {
  await createCommunity(page);
  await page.getByRole('link', { name: 'test community' }).click();
  await createPost(page);

  await expect(page.locator('h2')).toContainText('test post');
  await expect(page.getByRole('listitem')).toContainText('test post content');
  await expect(page.getByRole('listitem')).toContainText('Upvotes: 0');
  await expect(page.getByRole('listitem')).toContainText('Downvotes: 0');
  await expect(page.getByRole('listitem')).toContainText('Upvote');
  await expect(page.getByRole('listitem')).toContainText('Downvote');
  await expect(page.getByRole('listitem')).toContainText('Remove');
});

test('Post upvote works', async ({ page }) => {
  await createCommunity(page);
  await page.getByRole('link', { name: 'test community' }).click();
  await createPost(page);

  await page.getByRole('button', { name: 'Upvote' }).click();
  await expect(page.getByRole('listitem')).toContainText('Upvotes: 1');
  await expect(page.getByRole('listitem')).toContainText('Downvotes: 0');
});

test('Post removal works', async ({ page }) => {
  await createCommunity(page);
  await page.getByRole('link', { name: 'test community' }).click();
  await createPost(page);
  await page.waitForTimeout(1000);

  const postItem = page.getByText('test post test post content');
  await page.getByRole('button', { name: 'Remove' }).click();
  await expect(postItem).not.toBeVisible();
});

test('Comment creation works', async ({ page }) => {
  await createCommunity(page);
  await page.getByRole('link', { name: 'test community' }).click();
  await createPost(page);
  await page.getByRole('link', { name: 'test post' }).click();
  await createComment(page);
  await expect(page.getByRole('listitem')).toMatchAriaSnapshot(`
      - listitem:
        - paragraph: test comment
        - text: "Upvotes: 0 Downvotes: 0"
        - button "Upvote"
        - button "Downvote"
        - button "Remove"
      `);
});

test('Comment upvote works', async ({ page }) => {
  await createCommunity(page);
  await page.getByRole('link', { name: 'test community' }).click();
  await createPost(page);
  await page.getByRole('link', { name: 'test post' }).click();
  await createComment(page);

  await page.getByRole('button', { name: 'Upvote' }).click();
  await expect(page.getByRole('listitem')).toContainText('Upvotes: 1', { timeout: 1000 });
});

test('Comment removal works', async ({ page }) => {
  await createCommunity(page);
  await page.getByRole('link', { name: 'test community' }).click();
  await createPost(page);
  await page.getByRole('link', { name: 'test post' }).click();
  await createComment(page);
  
  const commentItem = page.getByText('test comment Upvotes: 0');
  await page.getByRole('button', { name: 'Remove' }).click();
  await expect(commentItem).not.toBeVisible();
});

test('Clicking logout logs out', async ({ page }) => {
  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page.getByRole('navigation')).toContainText('Hello anonymous!');
});



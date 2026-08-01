<script>
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { useAuthState } from "$lib/states/authState.svelte.js";

  let message = $state("");
  let errorMessage = $state("");
  let isLoading = $state(false);

  const authState = useAuthState();

  const handleForm = async (e) => {
    e.preventDefault();
    errorMessage = "";
    message = "";
    isLoading = true;

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      if (page.params.action === "login") {
        await authState.login(email, password);
        message = "Login successful! Redirecting...";
        setTimeout(() => goto("/"), 1000);
      } else {
        await authState.register(email, password);
        message = "Registration successful! You can now log in.";
        setTimeout(() => goto("/auth/login"), 2000);
      }
    } catch (error) {
      errorMessage = error.message;
    } finally {
      isLoading = false;
    }
  };
</script>

<h2 class="text-3xl mb-4">
  {page.params.action === "login" ? "Login" : "Register"}
</h2>

{#if message}
  <div class="preset-tonal-success rounded-lg p-3 mb-4 max-w-md">
    <p>{message}</p>
  </div>
{/if}

{#if errorMessage}
  <div class="preset-tonal-error rounded-lg p-3 mb-4 max-w-md">
    <p>{errorMessage}</p>
  </div>
{/if}

<form onsubmit={handleForm} class="max-w-md space-y-4">
  <label class="label">
    <span class="label-text">Email</span>
    <input
      id="email"
      name="email"
      type="email"
      placeholder="user@example.com"
      class="input"
      required
    />
  </label>
  <label class="label">
    <span class="label-text">Password</span>
    <input
      class="input"
      id="password"
      name="password"
      type="password"
      placeholder="Enter your password"
      required
    />
  </label>
  <button type="submit" disabled={isLoading} class="btn preset-filled-primary-500 disabled:opacity-50">
    {isLoading
      ? "Please wait..."
      : page.params.action === "login"
        ? "Login"
        : "Register"}
  </button>
</form>

{#if page.params.action === "login"}
  <p class="mt-6">
    Don't have an account? <a href="/auth/register" class="anchor">Register here</a>
  </p>
{:else}
  <p class="mt-6">
    Already have an account? <a href="/auth/login" class="anchor">Login here</a>
  </p>
{/if}
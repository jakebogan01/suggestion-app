<script>
     // import router from 'page';
     // import { getContext } from 'svelte';
     // grab the user store
     // const currentUser = getContext('user');

     // const handleLogout = () => {
     //      // Update user in local storage
     //      localStorage.setItem('user', null);
     //      currentUser.set(null);
     //      router.redirect('/login');
     // };
</script>

<header>
     <div>
          <a href="/">Workout Buddy</a>
          <nav>
               <!--{#if $currentUser}-->
               <!--     <div>-->
               <!--          <span>{$currentUser.email}</span>-->
               <!--          <button on:click={handleLogout} type="button">Log out</button>-->
               <!--     </div>-->
               <!--{:else if $currentUser === null}-->
               <!--     <div>-->
               <!--          <a href="/login">Login</a>-->
               <!--          <a href="/signup">Signup</a>-->
               <!--     </div>-->
               <!--{/if}-->
          </nav>
     </div>
</header>
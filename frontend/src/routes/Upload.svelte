<script>
     import { onMount, getContext } from 'svelte';
     export let params;
     // let users = [];

     // grab the user store
     const currentUser = getContext('user');

     onMount(async() => {
          // if ($currentUser !== null) {
          //      // Get all the workouts from the server
          //      const response = await fetch('/api/user', {
          //           headers: {
          //                'Content-Type': `application/json`,
          //           },
          //      });
          //      // Handle the response
          //      const data = await response.json();

          //      if (response.ok) {
          //           users[0] = data;
          //           console.log(data)
          //      }
          // }
     })

     const handleSubmit =  async (e) => {
          const response = await fetch('http://localhost:4000/api/user/uploadimage', {
               method: 'POST',
               body: new FormData(e.target),
          });
          const data = await response.json();
          console.log(data)
     }
</script>

<h1>image upload</h1>

<form on:submit|preventDefault={handleSubmit} enctype="multipart/form-data">
     <input type="file" name='image'>
     <input type="submit">
</form>

<!-- {#if users.length < 1}
     <p>no users</p>
{:else}
     {#each users[0] as user (user._id)}
          <img src={user?.profileImage} alt="" accept=".jpg, .jpeg, .png">
     {:else}
          <p>There are no users</p>
     {/each}
{/if} -->

<style>
     img {
          width: 400px;
          height: 400px;
          border: 2px solid blue;
     }
</style>
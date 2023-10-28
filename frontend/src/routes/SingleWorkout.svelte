<script>
     import { onMount, getContext } from 'svelte';
     // grab the user store
     const currentUser = getContext('user');
   
     export let params
  
     onMount(async () => {
          console.log(params.slug);
     });
   </script>
   
   <h1>single workout</h1>
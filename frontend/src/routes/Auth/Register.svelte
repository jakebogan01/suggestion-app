<script>
     /* svelte-ignore unused-export-let */
     export let params;
     import router from "page";
     import { getContext } from "svelte";

     const currentUser = getContext("user");
     let inputValues = {
          email: "",
          password: "",
     };
     let isLoading = null;
     let error = null;

     const handleSubmit = async (e) => {
          isLoading = true;
          error = null;

          const response = await fetch('/api/user/register', {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json',
               },
               body: JSON.stringify(inputValues),
          });

          const data = await response.json();

          if (!response.ok) {
               isLoading = false;
               error = data.error;
          } else {
               localStorage.setItem('user', JSON.stringify(data));

               currentUser.set(data);

               inputValues = {
                    email: '',
                    password: '',
               };

               router.redirect('/');
          }
     };
</script>

<form on:submit|preventDefault={handleSubmit}>
     <h3>Register Form</h3>

     <label for="email">Email:</label>
     <input type="email" on:change={(e) => (inputValues.email = e.target.value)} name="email" id="email" bind:value={inputValues.email} />
     
     <label for="password">Password:</label>
     <input type="password" on:change={(e) => (inputValues.password = e.target.value)} name="password" id="password" bind:value={inputValues.password} />

     <div>
          <button disabled={isLoading} type="submit">Register</button>
     </div>
     {#if error}
          <div class="error">{error}</div>
     {/if}
</form>

<div>
     <a href="/login">Login</a>
</div>
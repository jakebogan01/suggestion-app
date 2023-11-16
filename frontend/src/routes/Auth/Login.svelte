<script>
     /* svelte-ignore unused-export-let */
     export let params;
     import router from "page";
     import {getContext} from "svelte";

     const currentUser = getContext("user");
     let inputValues = {email: "", password: ""};
     let isLoading = null;
     let error = null;

     const handleSubmit = async () => {
          isLoading = true;
          error = null;

          const response = await fetch("/api/user/login", {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
               },
               body: JSON.stringify(inputValues),
          });
          const data = await response.json();

          if (!response.ok) {
               isLoading = false;
               error = data.error;
          } else {
               localStorage.setItem("user", JSON.stringify(data));
               currentUser.set(data);
               inputValues = {email: "", password: ""};
               router.redirect("/");
          }
     };
</script>


<div class="h-screen">
     <div class="registration min-h-full flex bg-black">
          <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
               <div class="mx-auto w-full max-w-sm lg:w-96 mt-6">
                    <div>
                         <div>
                              <header class="absolute top-16">
                                   <div class="w-20 md:w-24 cursor-default">
                                        <span class="sr-only">PNY Technology</span>
                                        <img class="w-20 md:w-24" src="/logo.png" alt="PNY Technologies Logo">
                                   </div>
                              </header>
                         </div>
                    </div>

                    <section class="mt-8">
                         <div class="mt-6">
                              <div class="pb-2">
                                   <h2 data-aos="fade-up" data-aos-delay="250" class="mt-16 md:mt-6 text-3xl font-extrabold text-white cursor-default">
                                        Create an account
                                   </h2>
                              </div>
                              <form on:submit|preventDefault={handleSubmit}>
                                   <div>
                                        <label class="block font-medium text-sm text-white" for="email"><span>Email</span></label>
                                        <input
                                                on:change={(e) => {inputValues.email = e.target.value; error = null;}}
                                                bind:value={inputValues.email}
                                                class="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm mt-1 block w-full"
                                                id="email"
                                                type="email"
                                                autofocus
                                                required
                                                autocomplete="username">
                                   </div>

                                   <div class="mt-4">
                                        <label class="block font-medium text-sm text-white" for="password"><span>Password</span></label>
                                        <input
                                                on:change={(e) => {inputValues.password = e.target.value; error = null;}}
                                                bind:value={inputValues.password}
                                                class="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm mt-1 block w-full"
                                                id="password"
                                                type="password"
                                                required
                                                autocomplete="current-password">
                                   </div>

                                   <div class="block mt-4">
                                        <!-- svelte-ignore a11y-label-has-associated-control -->
                                        <label class="flex items-center">
                                             <input
                                                     type="checkbox"
                                                     value=""
                                                     class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                             <span class="ml-2 text-sm text-white">Remember me</span>
                                        </label>
                                   </div>

                                   <div class="flex items-center justify-end mt-4">
                                        <span class="text-sm text-white ml-3">
                                             Don't have an account?
                                             <a class="hover:text-gray-300" href="/register">Register</a>
                                        </span>
                                        <button type="submit" class="ml-4 inline-flex items-center px-4 py-2 border {error ? 'bg-red-500 hover:bg-red-400 animate-[wiggle_0.2s_ease-in-out_0s_2_backwards]' : 'bg-[#238AB6] hover:bg-[#186489]'} border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:shadow-outline-gray transition ease-in-out duration-150" disabled={isLoading || error}>Login</button>
                                   </div>

                                   <div class="block mt-4">
                                        {#if error}
                                             <div class="text-red-400">{error}</div>
                                        {:else}
                                             <div class="h-6"></div>
                                        {/if}
                                   </div>
                              </form>
                         </div>
                    </section>
               </div>
          </div>
          <div class="relativ hidden lg:block relative w-0 flex-1">
               <div class="absolute inset-0 h-full w-[200px] z-50 bg-gradient-to-r from-black to-transparent"></div>
<!--               <iframe src='https://my.spline.design/clonercubesgenerativecopy-ba5d70ec6046fddc4566a0a52369aa2b/' frameborder='0' width='100%' height='100%' class="absolute inset-0 h-full w-full object-cover" loading="lazy"></iframe>-->
          </div>
     </div>
</div>

<style>
     :global(body) {
          height: 100vh;
     }
     :global(html) {
          height: 100vh;
     }
     :global(#app) {
          height: 100vh;
     }
</style>
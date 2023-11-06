<script>
    import router from "page";
    import { setContext } from 'svelte';
    import { writable } from 'svelte/store';
    import Navbar from "./lib/Components/Navbar.svelte";
    import Register from "./routes/Auth/Register.svelte";
    import Index from "./routes/Index.svelte";
    import Show from "./routes/Show.svelte";
    import Create from "./routes/Create.svelte";

    const user = writable(JSON.parse(localStorage.getItem('user')));
    setContext('user', user);

    let page
    let params

    router("/Register", () => page = Register );
    router("/", () => page = Index );
    router("/suggestion/create", () => page = Create );
    router("/suggestions/:slug",
        (ctx, next) => {
            params = ctx.params
            next()
        },
        () => (page = Show)
    );

    router.start()
</script>

<div class="font-manrope">
      <Navbar />
    <div>
        <svelte:component this="{ page }" params="{ params }" />
    </div>
</div>
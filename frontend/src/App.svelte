<script>
    import router from "page";
    import {setContext} from "svelte";
    import {writable} from "svelte/store";
    // import Navbar from "./lib/Components/Navbar.svelte";
    import Register from "./routes/Auth/Register.svelte";
    import Login from "./routes/Auth/Login.svelte";
    import Index from "./routes/Index.svelte";
    import Show from "./routes/Show.svelte";
    import Create from "./routes/Create.svelte";
    import Edit from "./routes/Edit.svelte";
    import error404 from "./routes/Error/404.svelte";

    const user = writable(JSON.parse(localStorage.getItem("user")));
    const suggestion = writable(JSON.parse(null));
    setContext("user", user);
    setContext("suggestion", suggestion);
    let page;
    let params;

    router("/Register", () => {
        if ($user) {
            return router("/");
        } else {
            page = Register
        }
    });
    router("/Login", () => {
        if ($user) {
            return router("/");
        } else {
            page = Login
        }
    });
    router("/", () => {
        if (!$user) {
            return router("/login");
        } else {
            page = Index
        }
    } );
    router("/suggestion/create", () => {
        if (!$user) {
            return router("/login");
        } else {
            page = Create
        }
    });
    router("/suggestion/edit/:slug", (ctx, next) => {
            params = ctx.params
            next()
        },
        () => {
            if (!$user) {
                return router("/login");
            } else {
                page = Edit
            }
        }
    );
    router("/suggestions/:slug", (ctx, next) => {
            params = ctx.params
            next()
        },
        () => {
            if (!$user) {
                return router("/login");
            } else {
                page = Show
            }
        }
    );
    router("*", () => {
        page = error404
    });

    router.start()
</script>

<!--<Navbar />-->

<div style="min-height: 100vh;">
    <svelte:component this="{page}" params="{params}" />
</div>

<style global>
    :global(body) {
        background-color: #f2f2f2;
    }
</style>
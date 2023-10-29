<script>
    import router from 'page';
    import { setContext } from 'svelte';
    import { writable } from 'svelte/store';
    import Navbar from './lib/Components/Navbar.svelte';
    import Home from './routes/Home.svelte'

    let page
    let params

    router('/', () => {
        page = Home
    })

    router.start()
</script>

<div class="font-manrope">
      <Navbar />
    <div>
        <svelte:component this="{page}" params="{params}" />
    </div>
</div>
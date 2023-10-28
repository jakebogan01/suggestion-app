<script>
    import router from 'page';

    // Routes
    import Home from './routes/Home.svelte'
    // import Signup from './routes/Signup.svelte'
    // import Login from './routes/Login.svelte'
    // import SingleBlog from './routes/SingleWorkout.svelte'
    // import Upload from './routes/Upload.svelte'


    // import { setContext } from 'svelte';
    // import { writable } from 'svelte/store';
    // import Navbar from './lib/components/Navbar.svelte';

    // create user store
    // const user = writable(JSON.parse(localStorage.getItem('user')));
    // set user store
    // setContext('user', user);


    // Variables
    let page
    let params

    // Set up the pages to watch for
    router('/', () => {
    // if ($user === null) {
    //   router.redirect('/login');
    // }
    page = Home
    })
    // router('/signup', () => {
    //   if ($user !== null) {
    //     router.redirect('/');
    //   }
    //   page = Signup
    // })
    // router('/login', () => {
    //   if ($user !== null) {
    //     router.redirect('/');
    //   }
    //   page = Login
    // })
    // router('/upload', () => {
    //   if ($user === null) {
    //     router.redirect('/');
    //   }
    //   page = Upload
    // })
    // router(
    //         '/workouts/:slug',
    //         (ctx, next) => {
    //           params = ctx.params
    //           next()
    //         },
    //         () => (page = SingleBlog)
    // )

    // Set up the router to start and actively watch for changes
    router.start()
</script>

<div>
    <!--  <Navbar />-->
    <div>
        <svelte:component this="{page}" params="{params}" />
    </div>
</div>
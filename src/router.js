import Vue from "vue"
import Router from "vue-router"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import firebase from "./services/firebaseConnection"

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/dashboard",
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/profile/:userid",
      component: Profile,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/login",
      component: Login
    },
  ]
})

//Varrer todas as rotas e veriicar se esta logado
router.beforeEach((to, from, next)=> {
  //verificando se existe alguma rota privada
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  //se a rota é privada e se não há usuario logado
  if(requiresAuth && !firebase.auth().currentUser) {
    next('/login')
  } else {
    next()
  }
})

export default router
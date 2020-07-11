import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import BlogPosts from '../views/BlogPosts.vue'
import Blog from '../views/Blog.vue'
import AddBlog from '../views/AddBlog.vue'
import Profile from '../views/Profile.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/blogposts',
    name: 'BlogPosts',
    component: BlogPosts
  },
  {
    path: '/blog/:id',
    name: 'Blog',
    component: Blog,
    props: true
  },
  {
    path: '/addblog/',
    name: 'AddBlog',
    component: AddBlog
  },
  {
    path: '/profile/',
    name: 'Profile',
    component: Profile
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

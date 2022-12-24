import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '/src/views/Home'
import About from '/src/views/About'
import Callback from "/src/views/Callback";
import DashboardMaster from "/src/views/DashboardMaster";
import Dashboard from "/src/views/Dashboard/Dashboard";
import Dynamics from "/src/views/Dashboard/Dynamics";
import Tagged from "/src/views/Dashboard/Tagged";
import Untagged from "/src/views/Dashboard/Untagged";
import Playlist from "/src/views/Dashboard/Playlist";
import NewPlaylist from "/src/views/Dashboard/NewPlaylist";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/callback',
    name: 'Callback',
    component: Callback
  },
  {
    path: '/dashboard',
    component: DashboardMaster,
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: '/dashboard/dynamics',
        name: 'Dynamics',
        component: Dynamics
      },
      {
        path: '/dashboard/tagged',
        name: 'Tagged',
        component: Tagged
      },
      {
        path: '/dashboard/untagged',
        name: 'Untagged',
        component: Untagged
      },
      {
        path: '/dashboard/p/:id',
        name: 'Playlist',
        component: Playlist
      },
      {
        path: '/dashboard/new',
        name: 'NewPlaylist',
        component: NewPlaylist
      },
    ]
  },
  {
    path: '*',
    name: '404',
    component: Home
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

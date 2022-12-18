import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import About from '@/views/About'
import Callback from "@/views/Callback";
import DashboardMaster from "@/views/DashboardMaster";
import Dashboard from "@/views/Dashboard/Dashboard";
import Dynamics from "@/views/Dashboard/Dynamics";
import Tagged from "@/views/Dashboard/Tagged";
import Untagged from "@/views/Dashboard/Untagged";
import Playlist from "../views/Dashboard/Playlist";

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

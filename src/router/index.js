import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/Home.vue"
import Vcards from "../components/vcards/Vcards.vue"
import Dashboard from "../components/Dashboard.vue"
import Admins from "../components/admins/Admins.vue"
import Admin from "../components/admins/Admin.vue"
import Vcard from "../components/vcards/Vcard.vue"
import Transactions from "../components/transactions/Transactions.vue"
import Transaction from "../components/transactions/Transaction.vue"
import Login from "../components/auth/Login.vue"
import ChangePassword from "../components/auth/ChangePassword.vue"
import ChangeConfirmationCode from "../components/auth/ChangeConfirmationCode.vue"
import Categories from "../components/categories/Categories.vue"
import Category from "../components/categories/Category.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/vcards",
    name: "Vcards",
    component: Vcards,
  },
  {
    path: "/register",
    name: "Register",
    component: Vcard,
  },
  {
    path: "/admins",
    name: "Admins",
    component: Admins,
  },
  {
    path: "/admins/:id",
    name: "EditingAdmin",
    component: Admin,
    props: (route) => ({
      id: parseInt(route.params.id),
    }),
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
  },
  {
    path: "/password/:userid",
    name: "Password",
    component: ChangePassword,
    props: (route) => ({
      userid: parseInt(route.params.userid),
    }),
  },
  {
    path: "/confirmation_code/:userid",
    name: "Code",
    component: ChangeConfirmationCode,
    props: (route) => ({
      userid: parseInt(route.params.userid),
    }),
  },
  {
    path: "/vcards/:phone_number",
    name: "EditingVcard",
    component: Vcard,
    props: (route) => ({
      phone_number: parseInt(route.params.phone_number),
    }),
  },
  {
    path: "/transactions",
    name: "Transactions",
    component: Transactions,
  },
  {
    path: "/transaction/:id",
    name: "EditingTransaction",
    component: Transaction,
    props: (route) => ({
      id: parseInt(route.params.id),
      transactionVcard: parseInt(route.params.transactionVcard),
    }),
  },
  {
    path: "/transaction",
    name: "NewTransaction",
    component: Transaction,
  },
  {
    path: "/categories",
    name: "Categories",
    component: Categories,
  },
  {
    path: "/categories/new",
    name: "NewCategory",
    component: Category,
  },
  {
    path: "/categories/:id",
    name: "EditingCategory",
    component: Category,
    props: (route) => ({
      id: parseInt(route.params.id),
      vcard: parseInt(route.params.vcard),
    }),
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

import store from "../store"

router.beforeEach((to, from, next) => {

  setTimeout(() => {
    if (!store.state.user && (to.name == "Login" || to.name == "Register")) {
      to.name == "Login" ? document.title = "vCard - Login" : document.title = "vCard - Register"
      next()
      return
    }   
  }, 100);

  if(to.name == "Home")
  {
    setTimeout(() => {
      if(store.state.user)
      {
        document.title = "vCard - Dashboard"
        next({ name: "Dashboard" })
        return
      }
      else
      {
        document.title = "vCard - Home"
        next()
        return
      }   
    }, 120);
  }
  // let logado = false
  let contador = 4
  let checkLogin = () => {
    if (store.state.user) {
      handlePermissions(to, from, next, store.state.user)
      return
    } else {
      contador--
      if (contador > 0) {
        setTimeout(checkLogin, 100)
      } else {
        next({ name: "Home" })
        return
      }
    }
  }
  checkLogin()
})

let handlePermissions = (to, from, next, user) => {
  if (to.name == "EditingTransaction") {
    //TODO: Como fazer para saber se a categoria é do user ou não
    if(user.user_type == "A")
    {
      next({ name: "Dashboard" })
      return  
    }
    if (user.user_type == "V" && to.params.transactionVcard == user.id) {
      document.title = "vCard - Editing Transaction"
      next()
      return
    }
    else
    {
      next({ name: "Transactions" })
      return
    }
  }

  if (user && to.name == "Dashboard") {
    document.title = "vCard - Dashboard"
    next()
    return
  }

  if (to.name == "NewTransaction") {
    if (user.user_type == "A") {
      next({ name: "Dashboard" })
      return
    }
    document.title = "vCard - Create Transaction"
    next()
    return
  }

  if (to.name == "Categories" || to.name == "NewCategory") {
    document.title = "vCard - Categories"
    next()
    return
  }

  if (to.name == "EditingCategory") {
    //TODO: Como fazer para saber se a categoria é do user ou não
    if (user.user_type == "A") {
      document.title = "vCard - Editing Categories"
      next()
      return
    } else if (user.user_type == "V" && to.params.vcard == user.id) {
      document.title = "vCard - Editing Categories"
      next()
      return
    }
    else
    {
      next({ name: "Categories" })
      return
    }
  }

  if(to.name == "EditingAdmin" && user.user_type == "A")
  {
    if(to.params.id == user.id)
    {
      document.title = "vCard - Editing Admin"
      next()
      return 
    }
    next({ name: "EditingAdmin", params: {id: user.id} })
    return
  }


  if (to.name == "Admin" && user.user_type == "A") {
      document.title = "vCard - Create Admin"
      next()
      return
  }

  if (to.name == "Password" && to.params.userid != user.id) {
    next({ name: "Password", params: {userid: user.id} })
    return
  } else if (to.name == "Password") {
    document.title = "vCard - Change Password"
    next()
    return
  }

  if (to.name == "Code")
  {
    if(user.user_type == "A")
    {
      next({ name: "Dashboard" })
      return
    }

    document.title = "vCard - Change Confirmation Code"
    if(to.params.userid != user.id)
    {
      next({ name: "Code", params: {userid: user.id} })
      return
    }
    next()
    return
  } 

  if (to.name == "Vcards" || to.name == "Admins") {
    if (user.user_type != "A") {
      next({ name: "Dashboard" })
      return
    }
    to.name == "Vcards" ? document.title = "vCard - Vcards" : document.title = "vCard - Admins"
    next()
    return
  }

  if (to.name == "Transactions" && user.user_type != "V") {
    next({ name: "Dashboard" })
    return
  } else if (to.name == "Transactions") {
    document.title = "vCard - Transactions"
    next()
    return
  }

  if (to.name == "EditingVcard") {
    if (to.params.phone_number == user.id || user.user_type == "A") {
      document.title = "vCard - Editing Vcard"
      next()
      return
    }
    next({ name: "EditingVcard", params: {phone_number: user.id} })
    return
  }

  next({ name: "Dashboard" })

}


export default router

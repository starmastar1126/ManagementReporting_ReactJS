import Loadable from 'react-loadable';

import LoadingComponent from '../Common/Loader';

export default [
  {
    path: '/chart/:type',
    exact: true,
    component: Loadable({
      loader: () => import('../Modules/Chart'),
      loading: LoadingComponent,
    }),
  },
  // { redirect: true, path: "/", to: "/chart/Fees", navbarName: "Redirect" }
  { redirect: true, path: "/", to: "/chart/Debtors", navbarName: "Redirect" }
]

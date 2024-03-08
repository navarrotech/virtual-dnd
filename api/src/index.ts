
// Types
import type { Routes } from '../types'
import type { Application } from 'express-ws'

// Express
import express from 'express'

import path from 'path'

// Sockets
import onSocketChange from './sockets/onChange'
import play           from './sockets/play'

// Auth
import Login          from './functions/auth/login'
import Logout         from './functions/auth/logout'
import EmailExists    from './functions/auth/emailExists'
import Forgot         from './functions/auth/forgot'
import GetAuth        from './functions/auth/getAuth'
import Reset          from './functions/auth/reset'
import Signup         from './functions/auth/signup'
import Update         from './functions/auth/update'
import Refresh        from './functions/auth/refreshSession'

// Friends
import AddFriend      from './functions/friends/add'
import RemoveFriend   from './functions/friends/remove'
import findFriends    from './functions/friends/find'

// Data
import DataAll        from './functions/data/all'
import DataCreate     from './functions/data/:table/create'
import DataDelete     from './functions/data/:table/delete'
import DataList       from './functions/data/:table/list'
import DataUpdate     from './functions/data/:table/update'

// Play
import GetPlayers     from './functions/play/getPlayers'
import GetChat        from './functions/play/getChat'
import GetNotes       from './functions/play/getNotes'
import SetNotes       from './functions/play/setNotes'
import JoinGame       from './functions/play/join'

// Images
import Avatars        from './functions/avatars'

export const routes =  <Routes>[
  // Auth
  { fn: Login,        path: 'dnd/auth/login'         },
  { fn: Logout,       path: 'dnd/auth/logout'        },
  { fn: EmailExists,  path: 'dnd/auth/emailExists'   },
  { fn: Forgot,       path: 'dnd/auth/forgot'        },
  { fn: GetAuth,      path: 'dnd/auth/getAuth'       },
  { fn: Reset,        path: 'dnd/auth/reset'         },
  { fn: Signup,       path: 'dnd/auth/signup'        },
  { fn: Update,       path: 'dnd/auth/update'        },
  { fn: Refresh,      path: 'dnd/auth/refresh'       },

  // Friends
  { fn: AddFriend,    path: 'dnd/friends/add'        },
  { fn: findFriends,  path: 'dnd/friends/find'       },
  { fn: RemoveFriend, path: 'dnd/friends/remove'     },

  // Data
  { fn: DataAll,      path: 'dnd/data/all'           },
  { fn: DataCreate,   path: 'dnd/data/:table/create' },
  { fn: DataDelete,   path: 'dnd/data/:table/delete' },
  { fn: DataList,     path: 'dnd/data/:table/list'   },
  { fn: DataUpdate,   path: 'dnd/data/:table/update' },

  // Play
  { fn: GetPlayers,   path: 'dnd/play/getPlayers'    },
  { fn: GetChat,      path: 'dnd/play/getChat'       },
  { fn: GetNotes,     path: 'dnd/play/getNotes'      },
  { fn: SetNotes,     path: 'dnd/play/setNotes'      },
  { fn: JoinGame,     path: 'dnd/play/join'          },

  // Images
  { fn: Avatars,      path: 'dnd/avatars'            },
]

export async function init(app: Application){
  app.ws('/dnd/changes', onSocketChange);
  app.ws('/dnd/play', play);
  app.use(
    express.static(
      path.resolve(__dirname, './public')
    )
  );
  return app;
}

export const serviceName = 'dnd'

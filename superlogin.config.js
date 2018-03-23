console.log(__dirname);
module.exports = {
  dbServer: {
    protocol: 'http://',
    host: process.env.COUCH_HOST + ':' + process.env.COUCH_PORT,
    user: process.env.COUCH_ADMIN,
    password: process.env.PASSWORD,
    userDB: 'sl-users',
    couchAuthDB: '_users'
  },
  mailer: {
    fromEmail: 'admin@grrrprrr.com',
    options: {
      service: 'Gmail',
        auth: {
          user: 'gmail.user@gmail.com',
          pass: 'userpass'
        }
    }
  },
  security: {
    maxFailedLogins: 3,
    lockoutTime: 600,
    tokenLife: 86400,
    loginOnRegistration: true,
  },
  userDBs: {
    defaultDBs: {
      private: ['userdb']
    },
    model: {
      userdb: {
        permissions: ['_reader', '_writer', '_replicator']
      }
    }
  },
  providers: {
    local: true
  }
}
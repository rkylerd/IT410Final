db.createUser(
    {
        user : "caps-secret-admin",
        pwd  : "caps-secret-admin-pwd",
        roles: [
            {
                role: "readWrite",
                db  : "caps-store"
            }
        ]
    }
)
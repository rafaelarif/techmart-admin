import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
    providers: [
        CredentialsProvider({
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const user = { username: "admin", password: "admin" }

                if (credentials.username === user.username && credentials.password === user.password) {
                    return user
                } else {
                    return null
                }
            }                      
        })
    ],
    secret: "89f47bff765816992b01e60b90863651"
})

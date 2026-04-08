import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_SECRET_ID || "",
        })
    ],
    session: {
        strategy: 'database'
    },
    callbacks: {
        async session({session}) {
            return {
                user:{
                    email:session.user?.email,
                    image:session.user?.image,
                    name:session.user?.name
                },
                expires:session.expires
            }
        },
        async redirect() {
            return '/role'
        }
    },
    secret: process.env.AUTH_SECRET,


})
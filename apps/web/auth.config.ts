import { JWT } from "@auth/core/jwt";
import { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
    //verifyRequest: "/auth/verify",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAuth = nextUrl.pathname.startsWith("/auth");
      const isOninvite = nextUrl.pathname.startsWith("/invitations/accept");

      if (isLoggedIn && isOnAuth) {
        return Response.redirect(new URL("/", nextUrl));
      }

      if (!isLoggedIn && !isOnAuth && !isOninvite) {
        return Response.redirect(new URL("/auth/login", nextUrl));
      }

      return true;
    },
    async jwt(props) {
      if (props.trigger == "update") {
        props.token = { ...props.token, ...props.session };
      }

      return props.token;
    },
    async session(props) {
      const { token } = props as { token: JWT };

      if (props.session.user && token.sub) {
        props.session.user.id = token.sub;
        if (token.image) {
          props.session.user.image = token.image as string;
        } else {
          props.session.user.image = token.picture;
        }
      }
      return props.session;
    },
  },
};

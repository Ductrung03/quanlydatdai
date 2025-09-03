// src/lib/auth.ts
import NextAuth, { DefaultSession, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// Extend NextAuth types to include custom fields
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      vai_tro: string;
      ho_ten: string;
      so_cccd?: string;
    } & DefaultSession['user'];
  }

  interface User {
    vai_tro: string;
    ho_ten: string;
    so_cccd?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    vai_tro: string;
    ho_ten: string;
    so_cccd?: string;
  }
}

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        ten_dang_nhap: { label: 'Tên đăng nhập', type: 'text' },
        mat_khau: { label: 'Mật khẩu', type: 'password' },
      },
      async authorize(credentials) {
        // Explicitly type credentials
        if (!credentials?.ten_dang_nhap || !credentials?.mat_khau) {
          return null;
        }

        const user = await prisma.nguoi_dung.findUnique({
          where: { ten_dang_nhap: credentials.ten_dang_nhap as string },
        });

        if (!user || !user.trang_thai_tai_khoan) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.mat_khau as string, // Type assertion to ensure string
          user.mat_khau_hash
        );

        if (!isValidPassword) {
          return null;
        }

        await prisma.nguoi_dung.update({
          where: { ma_nguoi_dung: user.ma_nguoi_dung },
          data: { lan_dang_nhap_cuoi: new Date() },
        });

        // Return a User object compatible with next-auth
        return {
          id: user.ma_nguoi_dung.toString(),
          name: user.ho_ten,
          email: user.email ?? null,
          vai_tro: user.vai_tro || 'user',
          ho_ten: user.ho_ten,
          so_cccd: user.so_cccd ?? undefined,
        } as User;
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.vai_tro = user.vai_tro;
        token.ho_ten = user.ho_ten;
        token.so_cccd = user.so_cccd;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.vai_tro = token.vai_tro;
        session.user.ho_ten = token.ho_ten;
        session.user.so_cccd = token.so_cccd;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
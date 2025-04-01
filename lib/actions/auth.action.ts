'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        const userRecord = await db.collection("users").doc(uid).get();

        if (userRecord.exists) {
            return {
                success: false,
                message: 'Este usuário já está registrado. Por favor, realize o login para continuar.'
            };
        }

        await db.collection("users").doc(uid).set({
            name, email
        });

        return {
            success: true,
            message: 'Conta criada com sucesso!'
        };

    } catch (e: any) {
        console.error('Erro ao registrar o usuário', e);

        if (e.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: 'O email informado já está cadastrado. Por favor, utilize outro email ou faça login.'
            };
        }

        return {
            success: false,
            message: 'Houve um erro ao criar sua conta. Por favor, tente novamente mais tarde.'
        };
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        // Tenta obter o usuário pelo e-mail
        const userRecord = await auth.getUserByEmail(email);

        if (!userRecord) {
            return {
                success: false,
                message: 'Usuário não encontrado. Por favor, verifique os dados e tente novamente.'
            };
        }

        // Define o cookie de sessão
        await setSessionCookie(idToken);

        return {
            success: true,
            message: 'Login realizado com sucesso!'
        };
    } catch (e: any) {
        console.error('Erro ao realizar login', e);

        // Verifica se o erro é de usuário não encontrado
        if (e.code === 'auth/user-not-found') {
            return {
                success: false,
                message: 'Usuário não encontrado. Por favor, verifique os dados e tente novamente.'
            };
        }

        return {
            success: false,
            message: 'Houve um erro ao realizar o login. Por favor, tente novamente mais tarde.'
        };
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    try {
        const sessionCookie = await auth.createSessionCookie(idToken, {
            expiresIn: ONE_WEEK * 1000,
        });

        cookieStore.set('session', sessionCookie, {
            maxAge: ONE_WEEK,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax'
        });
    } catch (e: any) {
        console.error('Erro ao criar cookie de sessão', e);
        throw new Error('Não foi possível criar o cookie de sessão.');
    }
}

export async function getCurrentUser(): Promise<User | null> {

    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) {
        return null;
    }

    try {
        const decodedClains = await auth.verifySessionCookie(sessionCookie, true);

        const userRecord = await db.collection('users').doc(decodedClains.uid).get();

        if (!userRecord.exists) return null

        return {
            ...userRecord.data(),
            id: userRecord.id
        } as User
    } catch (e) {
        console.error('Erro ao verificar sessão', e);

        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    
    return !!user;
}
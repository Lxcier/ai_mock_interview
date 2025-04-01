"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
} from "@/components/ui/form"
import FormField from '@/components/FormField'
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {useRouter} from "next/navigation";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "@/firebase/client";
import {signIn, signUp} from "@/lib/actions/auth.action";

const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(8),
    })
}

const AuthForm = ({ type }: { type: FormType }) => {
    const formSchema = authFormSchema(type)
    const router = useRouter()

    // 1. Defina o formulário.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: '',
            password: '',
        },
    })

    // 2. Defina o manipulador de envio.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (type === 'sign-up') {
                const { name, email, password } = values;

                const userCredential = await createUserWithEmailAndPassword(auth, email, password);

                const result = await signUp({
                    uid: userCredential.user.uid,
                    name: name!,
                    email: email,
                    password
                })

                if(!result?.success){
                    toast.error(result?.message);
                    return;
                }

                toast.success('Conta criada com sucesso! Por favor faça login.');
                router.push('/sign-in')
            } else {
                const { email, password} = values;

                const userCredential = await signInWithEmailAndPassword(auth, email, password);

                const idToken = await userCredential.user.getIdToken();

                if(!idToken) {
                    toast.error('Não foi possível realizar o login. Verifique seu email e senha.');
                    return;
                }

                await signIn({
                    email, idToken
                });

                toast.success('Login realizado com sucesso.')
                router.push('/')
            }
        } catch (error) {
            console.log(error);
            toast.error(`Ocorreu um erro ${error}`)
        }
    }

    const isSignIn = type === 'sign-in';

    return (
        <div className={'card-border lg:min-w-[566px]'}>
            <div className={'flex flex-col gap-6 card py-14 px-10'}>
                <div className={'flex flex-row gap-2 justify-center'}>
                    <Image src={'/logo.svg'} alt={'logotipo'} height={32} width={38} className={'h-auto w-auto'}/>
                    <h2 className={'text-primary-100'}>PrepWise</h2>
                </div>
                <h3 className={'text-center'}>Pratique entrevistas de emprego com IA</h3>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                        {!isSignIn && <FormField label={'Nome'}
                                                 control={form.control}
                                                 name={'name'}
                                                 placeholder={'Seu Nome'}/>}
                        <FormField label={'Email'}
                                   control={form.control}
                                   name={'email'}
                                   placeholder={'Seu Email'}
                                   type={'email'}/>

                        <FormField label={'Senha'}
                                   control={form.control}
                                   name={'password'}
                                   placeholder={'Sua Senha'}
                                   type={'password'}/>
                        <Button type="submit" className={'btn'}>
                            {isSignIn ? 'Entrar' : 'Criar uma Conta'}
                        </Button>
                    </form>
                </Form>
                <p className={'text-center'}>
                    {isSignIn ? "Ainda não tem uma conta?" : 'Já tem uma conta?'}
                    <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className={'font-bold text-user-primary ml-1'}>
                        {!isSignIn ? 'Entrar' : 'Cadastrar'}
                    </Link>
                </p>
            </div>
        </div>
    )
}
export default AuthForm
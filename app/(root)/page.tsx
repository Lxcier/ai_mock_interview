import React from 'react'
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {dummyInterviews} from "@/constants";
import InterviewCard from "@/components/InterviewCard";

const Page = () => {
    return (
        <>
            <section className={'card-cta'}>
                <div className={'flex flex-col gap-6 max-w-lg'}>
                    <h2>
                        <span className="sr-only">Simulador de Entrevistas</span>
                        Prepare-se para Entrevistas com Prática e Feedback Impulsionados por IA
                    </h2>
                    <p className={'text-lg'}>
                        Pratique com perguntas reais de entrevistas e receba feedback instantâneo para aprimorar suas
                        habilidades.
                    </p>

                    <Button asChild className={'btn-primary max-sm:w-full'}>
                        <Link href={'/interview'}>Começar uma Entrevista</Link>
                    </Button>
                </div>

                <Image src={'/robot.png'} alt={'Robot AI'} width={400} height={400} className={'max-sm:hidden w-auto h-auto'}/>
            </section>

            <section className={'flex flex-col gap-6 mt-8'}>
                <h2>Suas Entrevistas</h2>
                <div className={'interviews-section'}>
                    {dummyInterviews.map((interview) => (
                        <InterviewCard key={interview.id} {...interview}/>
                    ))}
                </div>

                {/*<p>Você ainda não iniciou nenhuma entrevista.</p>*/}
            </section>

            <section className={'flex flex-col gap-6 mt-8'}>
                <h2>Faça uma Entrevista</h2>
                <div className={'interviews-section'}>
                    {dummyInterviews.map((interview) => (
                        <InterviewCard key={interview.id} {...interview}/>
                    ))}
                </div>
                {/*<p>Nenhuma entrevista disponível no momento.</p>*/}
            </section>
        </>
    )
}
export default Page

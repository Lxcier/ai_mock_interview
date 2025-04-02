import React from 'react'
import Agent from "@/components/Agent";

const Page = () => {
    return (
        <>
            <h3>Geração de Entrevista</h3>
            <Agent userName={"Você"} userId={'user1'} type={"generate"}/>
        </>
    )
}
export default Page

"use client"
import useEmailBuilderStore from '@/app/store/emailBuilderStore'
import { Button } from '@/components/ui/button'
import { SquarePlus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CreateNewButtont = () => {
    const { resetStore } = useEmailBuilderStore()

    return (
        <Link href="/builder/new-template" className=" text-white rounded ">
            <Button onClick={() => resetStore()}>
                <SquarePlus /> Sukurti naują šabloną
            </Button>
        </Link>
    )
}

export default CreateNewButtont

import React from 'react'
import { EmailBuilderMain } from './components/EmailBuilderMain'

const EmailBuilderLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main><EmailBuilderMain>{children}</EmailBuilderMain></main>
    )
}

export default EmailBuilderLayout
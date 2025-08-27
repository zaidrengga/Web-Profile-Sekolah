"use client"

import { useAuth } from '@/hooks/use-auth'
import React from 'react'
import Loading from './ui/loading'

const LoadingLayout = ({ children }: { children: React.ReactNode }) => {
    const { loading } = useAuth()
    if (loading) return <Loading />
    return <>{children}</>
}

export default LoadingLayout
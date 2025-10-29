"use client"

import React from 'react'
import { useRouter } from 'next/navigation'

interface ButtonApplyJobProps {
    slug: string;
}

const ButtonApplyJob = ({ slug }: ButtonApplyJobProps) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/${slug}`)
  }

  return (
    <button
      onClick={handleClick}
      className="bg-[#FBC037] font-bold text-[14px] text-[#404040] rounded-lg py-2 px-4"
    >
      Apply
    </button>
  )
}

export default ButtonApplyJob

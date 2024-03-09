"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"

import { AspectRatio } from "@/components/ui/aspect-ratio"

const fetchImage = async (path: string) => {
  const response = await fetch(path)
  if (!response.ok) throw new Error("Network response was not ok")
  return await response.json()
}

const S3Image = ({ Key }: { Key: string }) => {
  const [data, setData] = useState<{ src?: string } | null>(null)

  useEffect(() => {
    fetchImage(`/api/documents/${Key}`)
      .then((data: { src?: string }) => {
        setData(data)
      })
      .catch((error) => {
        console.error("Error fetching image:", error)
        setData(null)
      })
  }, [Key])

  if (!data) {
    return <div>no image</div>
  }

  return (
    <AspectRatio ratio={1}>
      <Image
        fill
        sizes="100%"
        className="object-cover"
        alt={"gazou"}
        src={data.src ?? ""}
      />
    </AspectRatio>
  )
}

export default S3Image

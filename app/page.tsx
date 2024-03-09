"use client"

import React, { useEffect, useState } from "react"

import { Icons } from "@/components/icons"

import S3Image from "./s3image"

const fetchDocuments = async (path: string) => {
  const response = await fetch(path)
  if (!response.ok) throw new Error("Network response was not ok")
  return await response.json()
}

export default function IndexPage() {
  const [data, setData] = useState<{ Key?: string }[] | null>(null)

  useEffect(() => {
    fetchDocuments("/api/documents")
      .then((data: { Key?: string }[]) => {
        setData(data)
      })
      .catch((error) => {
        console.error("Error fetching documents:", error)
        setData(null)
      })
  }, [])

  if (!data) {
    return <div>no images</div>
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const formData = new FormData()
      Array.from(e.target.files).forEach((file) => {
        formData.append("file", file)
      })

      try {
        const response = await fetch("/api/documents", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const result = await response.json()
          console.log(result)
        } else {
          throw new Error("Network response was not ok")
        }
      } catch (error) {
        console.error("Error uploading file:", error)
      }
    }
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
        {data.map((doc, index) => (
          <S3Image Key={doc.Key ?? ""} key={doc.Key ?? index} />
        ))}
        <label
          className="flex h-full min-h-[100px] cursor-pointer items-center justify-center rounded-lg bg-accent p-4 hover:opacity-70"
          htmlFor="multi"
        >
          <div className="flex items-center gap-1">
            <Icons.moon className="size-4 text-ellipsis" />
            <p>Upload</p>
          </div>
        </label>
      </div>
      <input
        style={{ visibility: "hidden", position: "absolute", width: 0 }}
        type="file"
        id="multi"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  )
}

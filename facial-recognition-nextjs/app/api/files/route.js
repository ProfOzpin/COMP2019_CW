import { NextResponse } from 'next/server'
import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2 } from '../../../lib/r2'

export async function GET() {
    try {
        const command = new ListObjectsV2Command({
            Bucket: process.env.R2_BUCKET_NAME,
            MaxKeys: 50 // Limit to 50 files
        })

        const response = await r2.send(command)
        
        const files = response.Contents?.map(file => ({
            key: file.Key,
            size: file.Size,
            lastModified: file.LastModified,
            url: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${file.Key}`
        })) || []

        return NextResponse.json({ files })
    } catch (error) {
        console.error('Error listing files:', error)
        return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
    }
}

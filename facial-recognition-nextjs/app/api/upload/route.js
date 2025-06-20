import { NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2 } from '../../../lib/r2'

export async function POST(request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file')
        
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Generate unique filename
        const filename = `${Date.now()}-${file.name}`
        
        // Generate signed URL for upload
        const signedUrl = await getSignedUrl(
            r2,
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: filename,
                ContentType: file.type,
            }),
            { expiresIn: 3600 } // URL expires in 1 hour
        )

        // Convert file to buffer and upload directly
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to R2
        const uploadCommand = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: filename,
            Body: buffer,
            ContentType: file.type,
        })

        await r2.send(uploadCommand)

        // Construct public URL
        const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${filename}`

        // Send to Colab for facial recognition
        const colabResponse = await fetch(process.env.COLAB_API_URL + '/recognize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image_url: publicUrl
            })
        })

        let recognitionResults = null
        if (colabResponse.ok) {
            recognitionResults = await colabResponse.json()
        }

        return NextResponse.json({
            success: true,
            filename: filename,
            url: publicUrl,
            recognition_results: recognitionResults
        })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}

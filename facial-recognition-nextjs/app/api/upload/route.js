import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  try {
    console.log('R2 upload started...');
    
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      console.error('No file provided');
      return NextResponse.json({ 
        success: false, 
        error: 'No file provided' 
      }, { status: 400 });
    }

    console.log('File received:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('Uploading to R2 bucket:', process.env.CLOUDFLARE_R2_BUCKET_NAME);

    // Upload to R2
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
    });

    await r2Client.send(uploadCommand);

    const baseUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL.replace(/\/$/, ''); // Remove trailing slash
    const publicUrl = `${baseUrl}/${filename}`; // Single slash

    console.log('R2 upload successful, URL:', publicUrl);

    return NextResponse.json({
      success: true,
      filename: file.name,
      url: publicUrl,
      size: file.size
    });

  } catch (error) {
    console.error('R2 upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Upload failed' 
    }, { status: 500 });
  }
}

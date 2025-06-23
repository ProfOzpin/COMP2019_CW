import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function POST(request) {
  try {
    const { imageUrl, isCorrect } = await request.json();
    
    console.log('Feedback request:', { imageUrl, isCorrect });

    if (!imageUrl || typeof isCorrect !== 'boolean') {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: imageUrl and isCorrect'
      }, { status: 400 });
    }

    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db('face_recognition');
    const collection = db.collection('uploads');

    // Update the document with feedback - store boolean value directly
    const updateResult = await collection.updateOne(
      { imageUrl: imageUrl },
      { 
        $set: { 
          userFeedback: isCorrect,
          feedbackSubmittedAt: new Date()
        } 
      }
    );

    await client.close();

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Document not found for the provided image URL'
      }, { status: 404 });
    }

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Document found but not updated'
      }, { status: 400 });
    }

    console.log('Feedback updated successfully:', updateResult);

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback: isCorrect
    });

  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to submit feedback'
    }, { status: 500 });
  }
}

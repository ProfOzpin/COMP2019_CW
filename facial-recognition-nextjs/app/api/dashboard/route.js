import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db('face_recognition');
    const collection = db.collection('uploads');

    // Fetch all documents with recognition results
    const allData = await collection.find({
      recognitionResults: { $exists: true }
    }).toArray();

    // User Feedback Distribution
    const feedbackStats = await collection.aggregate([
      { $match: { userFeedback: { $exists: true } } },
      { $group: { _id: "$userFeedback", count: { $sum: 1 } } }
    ]).toArray();

    // Age Distribution
    const ageStats = await collection.aggregate([
      { $match: { "recognitionResults.age": { $exists: true } } },
      {
        $bucket: {
          groupBy: "$recognitionResults.age",
          boundaries: [0, 18, 25, 35, 45, 55, 65, 100],
          default: "65+",
          output: { count: { $sum: 1 }, images: { $push: "$imageUrl" } }
        }
      }
    ]).toArray();

    // Gender Distribution
    const genderStats = await collection.aggregate([
      { $match: { "recognitionResults.gender": { $exists: true } } },
      { 
        $group: { 
          _id: "$recognitionResults.gender", 
          count: { $sum: 1 },
          images: { $push: "$imageUrl" }
        } 
      }
    ]).toArray();

    // Emotion Distribution
    const emotionStats = await collection.aggregate([
      { $match: { "recognitionResults.emotion": { $exists: true } } },
      { 
        $group: { 
          _id: "$recognitionResults.emotion", 
          count: { $sum: 1 },
          images: { $push: "$imageUrl" }
        } 
      }
    ]).toArray();

    // Feedback Images
    const feedbackImages = await collection.aggregate([
      { $match: { userFeedback: { $exists: true } } },
      { 
        $group: { 
          _id: "$userFeedback", 
          images: { $push: "$imageUrl" }
        } 
      }
    ]).toArray();

    await client.close();

    return NextResponse.json({
      success: true,
      data: {
        totalAnalyses: allData.length,
        feedbackStats,
        ageStats,
        genderStats,
        emotionStats,
        feedbackImages
      }
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

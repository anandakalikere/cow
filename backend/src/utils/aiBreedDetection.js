import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

/**
 * Send image to AI API for breed prediction
 * @param {Buffer} imageBuffer - Image file buffer from multer
 * @param {string} fileName - Original file name
 * @returns {Promise} - AI prediction response {breed, confidence}
 */
export const predictCowBreed = async (imageBuffer, fileName) => {
  try {
    const AI_API_URL = process.env.AI_API_URL || 'http://localhost:8000';
    
    // Create form data with the image file
    const formData = new FormData();
    formData.append('file', imageBuffer, {
      filename: fileName,
      contentType: 'image/jpeg'
    });

    // Send request to AI API
    console.log(`Sending image to AI API: ${AI_API_URL}/predict-breed`);
    const response = await axios.post(`${AI_API_URL}/predict-breed`, formData, {
      headers: formData.getHeaders(),
      timeout: 30000 // 30 second timeout
    });

    console.log('AI API Response:', response.data);

    // Extract breed and confidence from response
    const { breed, confidence } = response.data;

    return {
      success: true,
      breed: breed || 'Unknown',
      confidence: confidence || 0
    };
  } catch (error) {
    console.error('AI Breed Detection Error:', error.message);
    
    return {
      success: false,
      breed: 'Unknown',
      confidence: 0,
      error: error.message
    };
  }
};

export const predictCowHealth = async (imageBuffer, fileName) => {
  try {
    const AI_API_URL = process.env.AI_API_URL || 'http://localhost:8000';
    const formData = new FormData();
    formData.append('file', imageBuffer, {
      filename: fileName,
      contentType: 'image/jpeg'
    });

    console.log(`Sending image to AI API: ${AI_API_URL}/predict-health`);
    const response = await axios.post(`${AI_API_URL}/predict-health`, formData, {
      headers: formData.getHeaders(),
      timeout: 30000
    });

    const { health_status, confidence } = response.data;

    return {
      success: true,
      status: health_status || 'Unknown',
      confidence: confidence || 0
    };
  } catch (error) {
    console.error('AI Health Detection Error:', error.message);
    return {
      success: false,
      status: 'Unknown',
      confidence: 0,
      error: error.message
    };
  }
};

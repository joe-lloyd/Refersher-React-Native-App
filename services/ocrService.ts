import TextRecognition, { TextRecognitionScript } from '@react-native-ml-kit/text-recognition';
import { pinyin } from 'pinyin-pro';

// Function to process the image and convert it to Chinese characters using ML Kit
export const processImage = async (imageUri: string): Promise<string> => {
  try {
    const recognizedText = await TextRecognition.recognize(imageUri, TextRecognitionScript.CHINESE);

    console.log("Recognized Text: ", recognizedText?.text);

    return recognizedText?.text || ''; // Return the recognized text or an empty string
  } catch (error) {
    console.error('Error during OCR:', error);
    return '';
  }
};


export const convertToPinyin = (chineseText: string): string => {
  const pinyinText = pinyin(chineseText, { type: 'string' }); // Converts to pinyin without tones
  console.log('Pinyin: ', pinyinText);
  return pinyinText;
};

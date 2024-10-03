import TextRecognition, { TextRecognitionScript } from '@react-native-ml-kit/text-recognition';
import { pinyin } from 'pinyin-pro';

// Function to process the image and convert it to Chinese characters using ML Kit
export const processImage = async (imageUri: string): Promise<string> => {
  try {
    const recognizedText = await TextRecognition.recognize(imageUri, TextRecognitionScript.CHINESE);

    console.log("Original Recognized Text: ", recognizedText?.text);

    // Filter out non-Chinese characters using regex
    const chineseOnlyText = (recognizedText?.text || '').match(/[\u4e00-\u9fff]/g)?.join('') || '';

    console.log("Filtered Chinese Text: ", chineseOnlyText);

    return chineseOnlyText;
  } catch (error) {
    console.error('Error during OCR:', error);
    return '';
  }
};

export const convertToPinyin = (chineseText: string): string => {
  const pinyinText = pinyin(chineseText, { type: 'string' });
  console.log('Pinyin: ', pinyinText);
  return pinyinText;
};

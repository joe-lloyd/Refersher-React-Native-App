import TextRecognition, {
  TextRecognitionScript,
  TextRecognitionResult,
} from '@react-native-ml-kit/text-recognition';
import { pinyin } from 'pinyin-pro';

interface RecognizedTextData {
  text: string;
  boundingBox: { x: number; y: number; width: number; height: number };
}

// Function to process the image and get both the Chinese text and its position
export const processImage = async (imageUri: string): Promise<RecognizedTextData[]> => {
  try {
    const recognizedResult: TextRecognitionResult = await TextRecognition.recognize(imageUri, TextRecognitionScript.CHINESE);

    // Extract recognized text and bounding boxes
    const recognizedData: RecognizedTextData[] = recognizedResult.blocks.map(block => ({
      text: block.text.match(/[\u4e00-\u9fff]/g)?.join('') || '', // Filter Chinese characters
      boundingBox: {
        x: block.frame.left,
        y: block.frame.top,
        width: block.frame.width,
        height: block.frame.height,
      },
    }))
      .filter(item => item.text)
      .map(block => ({...block, text: convertToPinyin(block.text)}))

    // console.log('Recognized Data: ', recognizedData);

    return recognizedData;
  } catch (error) {
    console.error('Error during OCR:', error);
    return [];
  }
};

export const convertToPinyin = (chineseText: string): string | undefined => {
  if (!chineseText) return;
  const pinyinText = pinyin(chineseText, { type: 'string' });
  return pinyinText;
};

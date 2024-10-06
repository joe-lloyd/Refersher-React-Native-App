import TextRecognition, {
  TextRecognitionScript,
  TextRecognitionResult,
} from '@react-native-ml-kit/text-recognition';
import { pinyin } from 'pinyin-pro';

interface RecognizedTextData {
  text: string;
  boundingBox: { x: number; y: number; width: number; height: number };
}

export const processImage = async (imageUri: string): Promise<RecognizedTextData[]> => {
  try {
    const recognizedResult: TextRecognitionResult = await TextRecognition.recognize(imageUri, TextRecognitionScript.CHINESE);

    // Extract recognized text and bounding boxes
    const recognizedData: RecognizedTextData[] = recognizedResult.blocks.map(block => {
      if (!block.frame) return;
      const text = block.text.match(/[\u4e00-\u9fff]/g)?.join('') || ''
      if (!text) return;

      return ({
        text,
        boundingBox: {
          x: block.frame.left,
          y: block.frame.top,
          width: block.frame.width,
          height: block.frame.height,
        },
      });
    })
      .filter(item => item && item.text)
      .map(block => ({...block as RecognizedTextData, text: convertToPinyin((block as RecognizedTextData).text)}))

    return recognizedData;
  } catch (error) {
    console.error('Error during OCR:', error);
    return [];
  }
};

export const convertToPinyin = (chineseText: string): string => {
  return pinyin(chineseText, { type: 'string' });
};

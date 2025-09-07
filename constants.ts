// Fix: Populated the constants file with a list of available image styles.
import { ImageStyle } from './types';

export const IMAGE_STYLES: ImageStyle[] = [
  {
    id: 'cinematic',
    name: 'Cinematic',
    promptModifier: 'cinematic, dramatic lighting, high detail, 8k',
    imageUrl: 'https://images.pexels.com/photos/3062545/pexels-photo-3062545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    promptModifier: 'cyberpunk, neon lights, futuristic, dystopian, vibrant colors',
    imageUrl: 'https://images.pexels.com/photos/2170387/pexels-photo-2170387.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'pixel-art',
    name: 'Pixel Art',
    promptModifier: 'pixel art, 16-bit, retro, video game style',
    imageUrl: 'https://images.pexels.com/photos/17651348/pexels-photo-17651348/free-photo-of-pixel-art-of-a-meadow.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    promptModifier: 'fantasy, epic, majestic, mythical, lord of the rings style',
    imageUrl: 'https://images.pexels.com/photos/163872/dubi-dubi-zafir-photography-163872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    promptModifier: 'watercolor painting, soft, blended colors, artistic',
    imageUrl: 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'line-art',
    name: 'Line Art',
    promptModifier: 'line art, black and white, minimalist, clean lines',
    imageUrl: 'https://images.pexels.com/photos/18413669/pexels-photo-18413669/free-photo-of-line-art-drawing-of-a-woman-s-face.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '3d-render',
    name: '3D Render',
    promptModifier: '3d render, octane render, high quality, photorealistic',
    imageUrl: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 'anime',
    name: 'Anime',
    promptModifier: 'anime style, vibrant, studio ghibli style, detailed background',
    imageUrl: 'https://images.pexels.com/photos/9301416/pexels-photo-9301416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

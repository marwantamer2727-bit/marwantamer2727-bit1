
export interface ImageStyle {
  id: string;
  name: string;
  promptModifier: string;
  imageUrl: string;
}

export interface ResultImage {
  src: string | null;
  isLoading: boolean;
  error: string | null;
  usedStyles: ImageStyle[];
}

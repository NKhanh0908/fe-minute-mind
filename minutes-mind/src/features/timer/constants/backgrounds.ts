export interface BackgroundPreset {
  id: string
  label: string
  url: string       // ảnh full-size dùng làm background
  thumbnail: string // ảnh nhỏ dùng trong picker grid
}

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: 'forest',
    label: 'Rừng sương',
    url: '/src/assets/backgrounds/forest.jpg',
    thumbnail: '/src/assets/backgrounds/forest.jpg',
  },
  {
    id: 'mountain',
    label: 'Núi cao',
    url: '/src/assets/backgrounds/mountain.jpg',
    thumbnail: '/src/assets/backgrounds/mountain.jpg',
  },
  {
    id: 'ocean',
    label: 'Biển',
    url: '/src/assets/backgrounds/ocean.jpg',
    thumbnail: '/src/assets/backgrounds/ocean.jpg',
  },
  {
    id: 'lofi-room',
    label: 'Phòng lofi',
    url: '/src/assets/backgrounds/lofi-room.jpg',
    thumbnail: '/src/assets/backgrounds/lofi-room.jpg',
  },
  {
    id: 'cafe',
    label: 'Quán cà phê',
    url: '/src/assets/backgrounds/cafe.jpg',
    thumbnail: '/src/assets/backgrounds/cafe.jpg',
  },
  {
    id: 'rainy',
    label: 'Mưa',
    url: '/src/assets/backgrounds/rainy.jpg',
    thumbnail: '/src/assets/backgrounds/rainy.jpg',
  },
]

export const DEFAULT_BACKGROUND_ID = 'forest'

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
    url: '/backgrounds/forest.jpg',
    thumbnail: '/backgrounds/forest.jpg',
  },
  {
    id: 'mountain',
    label: 'Núi cao',
    url: '/backgrounds/mountain.jpg',
    thumbnail: '/backgrounds/mountain.jpg',
  },
  {
    id: 'ocean',
    label: 'Biển',
    url: '/backgrounds/ocean.jpg',
    thumbnail: '/backgrounds/ocean.jpg',
  },
  {
    id: 'lofi-room',
    label: 'Phòng lofi',
    url: '/backgrounds/lofi-room.jpg',
    thumbnail: '/backgrounds/lofi-room.jpg',
  },
  {
    id: 'cafe',
    label: 'Quán cà phê',
    url: '/backgrounds/cafe.jpg',
    thumbnail: '/backgrounds/cafe.jpg',
  },
  {
    id: 'rainy',
    label: 'Mưa',
    url: '/backgrounds/rainy.jpg',
    thumbnail: '/backgrounds/rainy.jpg',
  },
]

export const DEFAULT_BACKGROUND_ID = 'forest'

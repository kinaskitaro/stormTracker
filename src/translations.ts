export type Language = 'en' | 'vi'

export interface Translations {
  // InfoPanel
  noStormSelected: string
  noStormSubtext: string
  trackingPoints: string
  noPointSelected: string
  noPointSubtext: string

  // PointCard categories
  tropicalDepression: string
  tropicalStorm: string
  hurricaneCat: string

  // PointCard labels
  mphWinds: string
  mbPressure: string
  funFact: string

  // Header
  title: string
}

export const translations: Record<Language, Translations> = {
  en: {
    noStormSelected: 'No Storm Selected',
    noStormSubtext: 'Search for a storm or select one from the dropdown to see its journey!',
    trackingPoints: 'tracking points',
    noPointSelected: 'No Point Selected',
    noPointSubtext: 'Click on a marker on the map to see details!',
    tropicalDepression: 'Tropical Depression',
    tropicalStorm: 'Tropical Storm',
    hurricaneCat: 'Hurricane Cat',
    mphWinds: 'mph Winds',
    mbPressure: 'mb Pressure',
    funFact: 'Fun Fact!',
    title: 'Storm Tracker for Kids'
  },
  vi: {
    noStormSelected: 'Chưa Chọn Bão',
    noStormSubtext: 'Tìm kiếm một cơn bão hoặc chọn từ danh sách để xem hành trình của nó!',
    trackingPoints: 'điểm theo dõi',
    noPointSelected: 'Chưa Chọn Điểm',
    noPointSubtext: 'Nhấp vào điểm đánh dấu trên bản đồ để xem chi tiết!',
    tropicalDepression: 'Áp thấp nhiệt đới',
    tropicalStorm: 'Bão nhiệt đới',
    hurricaneCat: 'Bão Cuồng Phong Cấp',
    mphWinds: 'Gió dặm/giờ',
    mbPressure: 'Áp suất mb',
    funFact: 'Sự Thú Vị!',
    title: 'Theo Dõi Bão Cho Trẻ Em'
  }
}

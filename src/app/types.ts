export type GPSLocation = {
    latitude: number
    longitude: number
    timestamp: number
}

export type Payload = {
    position: GPSLocation
    description?: string
    photo?: string
    audio?: string
}

export enum Encoding {
    mjpeg = "mjpeg",
    ros = "ros_compressed",
    png = "png",
    vp8 = "vp8",
    h264 = "h264",
}

export enum TransportLayer {
    raw = "raw",
    compressed = "compressed",
    theora = "theora",
}

export interface ImageStreamProps {
    topic: string;
    height?: number;
    width?: number;
    containerHeight?: number;
    containerWidth?: number;
    host?: string;
    port?: number;
    encoding?: Encoding;
    transportLayer?: TransportLayer;
    quality?: number;
    disabled?: boolean;
    bitrate?: number;
    qmin?: number;
    qmax?: number;
    gop?: number;
    vp8Quality?: string;
    imageStyle?: object;
}
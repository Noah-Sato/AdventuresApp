import { Dimensions,PixelRatio } from 'react-native';

const { width, height,fontScale } = Dimensions.get('window');
const screenHeight = width < height ? height : width;
const screenWidth = width < height ? width : height;
const isSmallDevice = screenWidth < 390

// 14 844
// 14 pro max 926
// base height 812
const BASE_HEIGHT = 844;
const BASE_WIDTH = 390;

// width to device pixels
const wTDP = ( widthPercent ) => {
  const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
}

// height to device pixels
const hTDP = ( heightPercent )=> {
  const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
}

// calculates size from height
// if scale is set to true it respects the system setting for font scaling
// maxScale is the highest scale factor that the text gets scaled up
const sizeFromHeight = ( size,scale=false,maxScale=2 ) => {
  if ( scale ) {
    const scaleFactor = fontScale > maxScale ? maxScale : fontScale;
    return pfHDP( ( size ) )* scaleFactor
  }
  return pfHDP(size)
}

// calculates size from width
// if scale is set to true it respects the system setting for font scaling
// maxScale is the highest scale factor that the text gets scaled up
const sizeFromWidth = ( size,scale=false,maxScale=2 ) => {
  if ( scale ) {
    const scaleFactor = fontScale > maxScale ? maxScale : fontScale;
    return pfWDP(( size ) ) * scaleFactor
  }
  return pfWDP(size)
}


// percentage from height
const pfH = ( height ) => {
  return ( height / BASE_HEIGHT )*100;
}
// percentage from width
const pfW = ( width ) => {
  return ( width / BASE_WIDTH )*100;
}

// percentage from height to device pixels
const pfHDP = ( height ) => {
  return hTDP( pfH(height) );
}

// percentage from width to device pixels
const pfWDP = ( width ) => {
  return wTDP( pfW(width) );
}

const pageMarginsSide = isSmallDevice ? pfHDP(16) : pfHDP(20);
const pageMarginsHZ = isSmallDevice ? pfHDP(16) : pfHDP(20);

//*1.414
export default {
  // Window Dimensions
  screen: {
    height: screenHeight,
    width: screenWidth,
    fontScale: fontScale
  },
  bRadius: 4,
  bRadiusL: 6,
  wTDP: wTDP,
  pfH: pfH,
  pfW: pfW,
  hTDP: hTDP,
  pfHDP: pfHDP,
  pfWDP: pfWDP,
  sizeFromHeight: sizeFromHeight,
  sizeFromWidth: sizeFromWidth,
  isSmallDevice: isSmallDevice,
  margins: {
    xxs: pfHDP(2), // 2,
    m: pfHDP(10),
    page: pageMarginsSide,
    pageHZ: pageMarginsHZ,
    
  },
  spacing: {
    xs3: pfHDP(2), //2
    xs2: pfHDP(4), //4
    xs: pfHDP(8), //8
    s: pfHDP(16), //16
    m: pfHDP(24), //24
    l: pfHDP(32), //32
    l2: pfHDP(36), //36
    xl: pfHDP(40), //40
    xl2: pfHDP(48), //48
    xl3: pfHDP(56), //56
  },

  buttonSpacing: {
    small: pfHDP(8),
    medium: pfHDP(10), 
    large: pfHDP(12),
    xlarge: pfHDP(14),
  },
 // sizes to be adjusted
  roundness: {
    xs2: 4, //4
    xs: 8, //8
    s: 16, //16
    m: 24, //24
    l: 32, //32
    l2: 36, //36
    xl: 40, //40
    xl2: 48, //48
    max: 999,
  },

  //roundess or corner radius.
 
  sizes: {
    icons: Math.max(Math.min(pfWDP(40),30),50),
    pageWidth: wTDP(100) - pageMarginsSide * 2,
    markers: Math.max(Math.min(pfWDP(40),30),40),
  },
  images: {
    x4x3: 1.33,
    x16x9: 1.77,
    x1x1: 1,
    x2x1: 1.99,


  },
  swipers: {
    x4x3: 0.75,
    x16x9: 0.5625,
    x1x1: 1,
    x2x1: 0.5,
    listingLarge: 0.957


  },
  pixelDensity: PixelRatio.get(),

};









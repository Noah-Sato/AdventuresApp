import { APIConstants } from "@config/API";
import { currencies } from "@config/Currencies";
import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import * as Location from 'expo-location';
import {compareAsc  } from "date-fns";
import analytics from "@react-native-firebase/analytics";
import { Dictionary } from "./config/Dictionary";

export const updateUserLocation = async (askedBefore = false) => {
  let status = null
  if ( !askedBefore ) {
    const newPermissionStatus = await Location.requestForegroundPermissionsAsync();
    status = newPermissionStatus.status
  } else {
    const permissionStatus =  await Location.getForegroundPermissionsAsync();
    status = permissionStatus.granted ? 'granted' : 'denied'
  }

  if (status !== 'granted') {
    console.log('Permission to access location was denied');
    return false;
  } else {
    let location = await Location.getCurrentPositionAsync({});
    return location
  }
  return null;

};

export const getPropertyByString = function(obj,property) {
  if (!property)
    return obj;

  let prop;
  const props = property.split('.');

  for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
    prop = props[i];

    var candidate = obj[prop];
    if (candidate !== undefined) {
      obj = candidate;
    } else {
      break;
    }
  }
  return obj[props[i]];
}

export const outputGuestsAndRooms = (status) =>{
  rooms = outputRooms(status)
  guests = outputGuests(status)
  return `${rooms} / ${guests}`
}

export const outputGuests = (status) =>{
  let guests = 0
  status.forEach((room,index)=>{
    guests += room.adults
    if ( room.children ) {
      guests += room.children;
    }
  })
  guests = guests > 1 ? `${guests} Guests` : `${guests} Guest`;
  return guests
}

export const outputRooms = (status) =>{
  const rooms = status.length>1 ? `${status.length} Rooms` : `${status.length} Room`
  return rooms
}

export const formatGuestsAndRoomsForQuery = (status) => {
  let output = 'roomsList='
  let outputRooms = []
  status.forEach((room)=>{
    let roomOutput = ''
    roomOutput += `adults=${room.adults}`
    roomOutput += `+children=`
    let outputChildren = []
    if ( room.children !== 0 ) {
      room.childAges.forEach((ca)=>{
        outputChildren.push(`age=${ca}`)
      })
    }
    roomOutput += outputChildren.join(';')
    outputRooms.push(roomOutput)
  })
  output += encodeURIComponent(outputRooms.join('&'))
  return output
}

export const formatGuestAndRoomsforBooking = (status) => {
  let output= `counterbox_rooms=${status.length}`
  let outputRooms = []
  let roomIndex = 1
  status.forEach((room)=>{
    let roomOutput = []
    roomOutput.push(`counterbox_adult_${roomIndex}=${room.adults}`)
    roomOutput.push(`counterbox_children_${roomIndex}=${room.children}`)
    if ( room.children !== 0 ) {
      let childIndex = 1
      room.childAges.forEach((ca)=>{
        roomOutput.push(`child_age_${roomIndex}_${childIndex}=${ca}`)
        childIndex++
      })
    }
    outputRooms.push(roomOutput.join('&'))
    roomIndex++
  })
  return `${output}&${outputRooms.join('&')}`
}

export const formatDatesForQuery = ({arrival,departure}) => {
  return `startDate=${arrival}&endDate=${departure}`
}

export const formatDatesForBooking = ({arrival,departure}) => {
  return `arrival=${arrival}&departure=${departure}`
}

const config = {
  headers: { Authorization: `Bearer ${APIConstants.jwtToken}` },
  auth: {
    username: APIConstants.apiUser,
    password: APIConstants.apiPassword
  }
};



export const genericGetFromURL = async function(url) {
  const response = await axios.get(url);
  return response.data;
}

export const secureStorePutValue = async function({key,value}) {
  console.log('setting secure store',key,value)
  await SecureStore.setItemAsync(key, value);
}

export const secureStoreGetValue  = async function(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result
  } else {
    return false
  }
}

export const formatPrice = function({price,currency}) {
  const currencyInfo = currencies.find((el)=>el.code == currency)
  if ( currencyInfo ) {
    return `${currencyInfo.symbol} ${price.toLocaleString('en-US', {maximumFractionDigits:2})}`
  } else {
    return `${currency} ${price.toLocaleString('en-US', {maximumFractionDigits:2})}`
  }
}

export const priceInPreferredCurrency = function({price,currency,rates,userCurrency}) {
  if ( userCurrency == currency ) {
    // same currency output nothing
    return ''
  } else {
    const currencyInfo = currencies.find((el)=>el.code == userCurrency)
    // Convert price from original currency to USD (base currency)
    if ( rates[currency] === undefined ) {
      return ''
    }
    const priceInUSD = price / rates[currency];

    // Convert USD to user currency
    const priceInUserCurrency = priceInUSD * rates[userCurrency];
    if ( rates[userCurrency] === undefined ) {
      return ''
    }
    return `appox. ${currencyInfo.symbol} ${priceInUserCurrency.toLocaleString('en-US', {maximumFractionDigits:2})}`
  }
}

export const haversineDistance = function(lat1, lon1, lat2, lon2) {
  const toRadians = angle => angle * (Math.PI / 180);
  const R = 6371; // Radius of the Earth in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
}

export const findClosestLocations = function(initalFocus, locations, numClosest = 5) {
  return locations.map(location => {
      const distance = haversineDistance(initalFocus.latitude, initalFocus.longitude, location.latitude, location.longitude);
      return { ...location, distance };
  })
  .sort((a, b) => a.distance - b.distance)
  .slice(0, numClosest);
}

export const  debounce = function(callback, wait) {
    let timeout;
    return (...args) => {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => callback.apply(context, args), wait);
    };
}



export const imagePlaceholder = require('@assets/placeholder200.png')







export const randomImage = (imgArray) => {
  
  const arrayLength = imgArray.length
  returnImage = imgArray[Math.floor(Math.random() * arrayLength)];
  
  return returnImage

}



export const navigateToHotels = ({router,hotels,title,useStore,backUrl,backParamsId}) => {

  let newUserState = useStore.getState().user
  newUserState.useDetails = false
  useStore.setState({user:newUserState})
  router.push({
    pathname:'/home/hotels',
    params:{
        hotels:hotels,
        name: title,
        backUrl: backUrl,
        backParamsId: backParamsId
  }})
  if ( hotels.length < 6 ) {
      router.navigate('/travel-details')
  } 


}

export const navigateToRegister = ({router,user}) => {
  if ( user !== undefined ) {
    if ( !user.emailConfirmed ) {
      router.navigate('/register-email')
    } else {
      router.navigate('/register')
    }
  } else {
    router.navigate('/register-email')
  }
}


export const navigateToHotelsForSwipers = ({router,hotels,title,useStore,backUrl,backParamsId,text,prehead}) => {

  let newUserState = useStore.getState().user
  newUserState.useDetails = false
  useStore.setState({user:newUserState})
  router.push({
    pathname:'/home/hotels',
    params:{
        hotels:hotels,
        backUrl: backUrl,
        backParamsId: backParamsId,
        Prehead:prehead,
        OfferHead:title,
        OfferText:text,
  }})
  if ( hotels.length < 6 ) {
      router.navigate('/travel-details')
  } 


}


export const navigateToDestinationsForSwipers = ({router,ID,path,continentID}) => {

  router.push({
    pathname:path,
    params:{
        backUrl: '/home',
        Id:ID,
        continentID:continentID,
        reset:true
  }})
  


}



export const getHotelInfoFromReservation = function(reservation,hotelDetailsEntries) {
  if ( reservation === null ) {
    return null
  }
  let matchingHotels = hotelDetailsEntries.filter(hotel => hotel.title === reservation.hotelTitleField);
   // If more than one hotel matches by title, narrow down using city and country
  if (matchingHotels.length > 1) {
      matchingHotels = matchingHotels.filter(hotel =>
          hotel.location && hotel.location.name === `${reservation.hotelCityField}, ${reservation.hotelCountryField}`
      );
  }
  // If more than one hotel still matches, narrow down using description
  if (matchingHotels.length > 1) {
      matchingHotels = matchingHotels.filter(hotel => hotel.descriptionTitle === reservation.hotelDescriptionField);
  }
  // Return the first match, or null if no match is found
  if ( matchingHotels.length  == 0 ) {
    console.log('hotel not found',reservation.hotelTitleField)
  }
  return matchingHotels.length > 0 ? matchingHotels[0] : null;
  

}






export const dataCleaner = function(array) {
  let result = array.filter((entry) => entry !== undefined)
  
  if ( result.length == 0 ) {
    
  } else {
    return result
}}

export const logAnalyticsEvent = async function(event,params) {
  await analytics().logEvent(event,params);
}




export const bookingsDateSorter = ({bookingsData}) => {
  let sortedBookings = [{
    "checkinDateField": "0000-00-00T00:00:00"
  }]
  
  let dateToCheck = null
  let foundItem = null

  console.log(sortedBookings, 'start')


  bookingsData.forEach((item) => {

    dateToCheck = item.checkinDateField
    foundItem = sortedBookings.findIndex((element) => compareAsc(dateToCheck, element.checkinDateField) == 1)


    if (foundItem == -1 ) {

      sortedBookings.push(item)
      

    } if (foundItem == 0) {
      sortedBookings.splice(0, 0, item)
      
    } else {
      sortedBookings.splice((foundItem), 0, item)
      
    }
    
  })
  sortedBookings.pop()
  sortedBookings.reverse()

  return(sortedBookings)
}

export const compareVersionStrings = function(requiredVersion, actualVersion) {
  // Split the version strings into arrays, treating any missing parts as 0
  const requiredParts = requiredVersion.split('.').map(Number);
  const actualParts = actualVersion.split('.').map(Number);
  
  // Pad both arrays to have a length of 3 (major, minor, subversion), filling with 0 if necessary
  while (requiredParts.length < 3) requiredParts.push(0);
  while (actualParts.length < 3) actualParts.push(0);

  // Compare each part of the version
  for (let i = 0; i < 3; i++) {
    if (actualParts[i] > requiredParts[i]) return true; // actual is greater
    if (actualParts[i] < requiredParts[i]) return false; // actual is smaller
  }

  return true; // versions are equal
}
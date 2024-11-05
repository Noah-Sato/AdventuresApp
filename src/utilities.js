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



















export const dataCleaner = function(array) {
  let result = array.filter((entry) => entry !== undefined)
  
  if ( result.length == 0 ) {
    
  } else {
    return result
}}

export const logAnalyticsEvent = async function(event,params) {
  await analytics().logEvent(event,params);
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




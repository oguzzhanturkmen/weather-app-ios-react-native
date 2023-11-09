import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Image } from 'react-native'
import {theme} from "../theme/index"
import { TextInput } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { MagnifyingGlassIcon , CalendarDaysIcon} from 'react-native-heroicons/outline'
import { useState, useCallback } from 'react'
import { MapPinIcon } from 'react-native-heroicons/solid'
import {debounce} from "lodash"
import { fetchLocations, fetchWeatherForecast } from '../api/WeatherApi'
import { BlurView } from 'expo-blur'
import { weatherImages, bgImages } from '../constants'
import * as Progress from 'react-native-progress';
import { storeData, getData } from '../utils/asyncStorage'



export default function HomeScreen() {

    const [showSearch, toggleSearch] = useState()
    const [locations, setLocations] = useState([])
    const [forecast, setForecast] = useState([])
    const [progress, setProgress] = useState(true)
    const [currentWeather, setCurrentWeather] = useState("")
   

   


    useEffect(() => {
        fetcPreData()
    }
    , [])

    const handleLocation = (location) => {
        setLocations([])
        setProgress(true)
        fetchWeatherForecast({cityName: location.name, days: 7}).then(data => {
            setForecast(data)
            setCurrentWeather(data.current.condition.text)
            storeData("lastLocation", location.name)
            setProgress(false)
        }
        )

    }

    const handleSearch = (text) => {
        if(text.length > 2){
            fetchLocations({cityName: text}).then(data => {
                setLocations(data)
                console.log(data)
            })
           
            
        }
    }

    fetcPreData = async () =>{
        let lastLocation = await getData("lastLocation")
        let cityName = lastLocation ? lastLocation : "Istanbul"


        fetchWeatherForecast({cityName, days: 7}).then(data => {
            setCurrentWeather(data.current.condition.text)
            setForecast(data)
            setProgress(false)
        }
        )
    }

    
        

    const handleTextDebounce = useCallback(debounce(handleSearch, 1000), [])

    const {current, location} = forecast;



  return (
    <View className="flex-1 relative">
        <StatusBar style="light" />
       
      <Image  blurRadius={20} source={bgImages[currentWeather]} className="h-full  w-full absolute"/>

      {progress ? (<View className="flex-1 flex justify-center items-center">
        <Progress.CircleSnail color={["white"]} size={100} />
        </View>
        ) :
      (<SafeAreaView className="flex-1 flex" > 

      {/* Search Bar */}

    <View style={{height: "7%"}} className="mx-4 relative ">
   
      <View  className=" flex-row justify-end items-center rounded-full" style={{backgroundColor : showSearch ? theme.bgBlack (0.5) : "transparent"}}>
      
          {showSearch? (
          
          <TextInput 
          onChangeText={handleTextDebounce}
          placeholder='Search City'
          placeholderTextColor="lightgray"
          className="pl-6 flex-1 pb-1 h-10 text-base text-white "></TextInput> ) : null
          
      }
          

          <TouchableOpacity
           style={{backgroundColor : theme.bgBlack(0.3)}} 
           className="rounded-full p-3 m-1 z-50" 
           onPress={() => {toggleSearch(!showSearch) ; showSearch ? null :setLocations([])}}
           >
              <MagnifyingGlassIcon size="25" color={"white"} />
              </TouchableOpacity>
          </View>

          {locations.length > 0 && showSearch ?  (
              <View className="absolute top-16 w-full rounded-3xl  z-10 shadow-2xl overflow-hidden  ">
              <BlurView 
              tint="dark"
              intensity={60}
              blurRadius={100}
              className=""
              >
                  {
                      locations.map((location, index) => {
                          let showBorder = index + 1 != locations.length;
                          let borderClass = showBorder ? "border-b-2 border-b-gray-400" : ""
                          return (
                             <TouchableOpacity 
                             onPress={() => handleLocation(location)}
                             className={"flex-row items-center border-0 p-4 px-4 mb-1 " + borderClass}
                             key={index}
                             >
                              <MapPinIcon size="20" color="white" />
                              <Text className="mx-4 text-white text-bold text-lg"> {location?.name}, {location?.country}</Text>
                             </TouchableOpacity>
                          )

                      })
                  }

              </BlurView>
              </View>
              
          ) : null}
          </View>


              {/* Forecast Section */}
              <View className="flex-1 flex mb-2 mx-4 justify-around -z-10 ">
                  
                  {/* Location */}
                  <View className=" rounded-3xl  shadow-4xl overflow-hidden   ">
                  <BlurView tint="dark"
                        intensity={60}
                        blurRadius={100}
                        className="p-4">
                  <Text className="text-3xl font-bold text-white text-center  ">{location?.name}  
                  
                  </Text>
                  <Text className="text-xl text-gray-300 font-semibold text-center ">{location?.country}</Text>
                  </BlurView>
                    </View>

                  {/* Weather Image */}
                  <View className="flex-row justify-center">
                      <Image source={weatherImages[current?.condition?.text]} className="h-52 w-52"/>
                  </View>
                  

                  {/* Degree Celcius */}
                  <View className="space-y-2">
                      <Text className="text-6xl font-bold text-white  text-center">{current?.temp_c}°</Text>
                      <Text className="text-xl font-bold text-white  text-center tracking-widest">{current?.condition?.text}</Text>
                  </View>
                   {/* Other Informations */}
                      <View className="flex-row justify-between mx-4">
                          <View className="flex-row space-x-2 items-center">
                              <Image source={require("../assets/icons/wind.png")} className="h-6 w-6"/>
                              <Text className="text-white text-lg font-semibold">{current?.wind_kph}</Text>
                          </View>

                          <View className="flex-row space-x-2 items-center">
                              <Image source={require("../assets/icons/drop.png")} className="h-6 w-6"/>
                              <Text className="text-white text-lg font-semibold">{current?.humidity}%</Text>
                          </View>

                          <View className="flex-row space-x-2 items-center">
                              <Image source={require("../assets/icons/sun.png")} className="h-6 w-6"/>
                              <Text className="text-white text-lg font-semibold">{forecast.forecast.forecastday[0].astro.sunrise.split(" ")[0] }</Text>
                          </View>
                      </View>

                  </View>

                   {/* Forecast Next Days */}
                   <View className="mb-2 space-y-3">
                      <View className="flex-row items-center mx-5 space-x-2">
                          <CalendarDaysIcon size="22" color="white" />
                          <Text className="text-white text-lg font-semibold">Daily Forecast</Text>
                      </View>
                      <ScrollView horizontal={true} 
                          contentContainerStyle={{paddingHorizontal: 15}}
                          showsHorizontalScrollIndicator={false}
                          >
                              {forecast?.forecast?.forecastday?.map((day, index) => {
                                   let date = new Date(day?.date);
                                   let dayName = date.toLocaleDateString('en-US', {weekday: 'long'}).split(",")[0];


                                  return (
                                      <View 
                                  className="flex justify-center items-center w-28 rounded-3xl py-3 space-y-1 mr-4"
                                  style={{backgroundColor : theme.bgBlack(0.15)}}  >
                                      
                                       <Image source={weatherImages[day?.day?.condition?.text]} className="h-11 w-11"/>
                                       <Text className="text-white text-lg font-semibold">{dayName}</Text>
                                       <Text className="text-white text-xl font-semibold ">{day?.day?.avgtemp_c}°</Text>
                                       
                              </View>
                                  )
                          
                              }
                              )
                          }
                      </ScrollView>
                   </View>
          </SafeAreaView>)
      
      
      }
    </View>
  )
}
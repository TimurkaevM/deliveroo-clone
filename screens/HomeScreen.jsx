import { View, Text, Image, TextInput, ScrollView } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import StatusBarPlaceHolder from "../misc/StatusBarPlaceHolder";
import { UserIcon, ChevronDownIcon } from "react-native-heroicons/outline";
import Svg, { Circle, Path } from "react-native-svg";
import Categories from "../components/Categories";
import FeaturedRow from "../components/FeaturedRow";
import sanityClient from "../sanity";

const HomeScreen = () => {
  const navigation = useNavigation();

  const [featuredCategories, setFeaturedCategories] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    sanityClient
      .fetch(
        `
    *[_type == 'featured'] {
      ...,
      restaurants[]->{
        ...,
        dishes[]->
      }
    }
    `,
      )
      .then((data) => setFeaturedCategories(data));
  }, []);

  return (
    <>
      <StatusBarPlaceHolder />
      <View className="bg-white pt-5">
        <View className="flex-row pb-4 items-center mx-4 space-x-2">
          <Image
            source={{
              uri: "https://images.squarespace-cdn.com/content/v1/557d3619e4b0452ec69c411b/1594826945762-C411RFU5ARHRF6J3TSMJ/deliveroo+PW.png",
            }}
            className="h-7 w-7 bg-gray-300 p-4 rounded-full"
          />
          <View className="flex-1">
            <Text className="font-bold text-gray-400 text-xs">Deliver Now!</Text>
            <Text className="font-bold text-xl">
              Current Location
              <ChevronDownIcon color="#00ccbb" size={20} />
            </Text>
          </View>
          <UserIcon size={35} color="#00ccbb" />
        </View>
        <View className="flex-row items-center space-x-2 pb-2 mx-4">
          <View className="flex-row space-x-2 flex-1 bg-gray-200 p-3">
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#00ccbb"
              className="w-6 h-6">
              <Path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </Svg>
            <TextInput placeholder="Restaurants and cuisines" keyboardType="default" />
          </View>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#00ccbb"
            className="w-6 h-6">
            <Path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5"
            />
          </Svg>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="bg-gray-100"
          contentContainerStyle={{ paddingBottom: 150 }}>
          <Categories />
          {featuredCategories?.map((category) => {
            return (
              <FeaturedRow
                key={category._id}
                id={category._id}
                title={category.name}
                description={category.short_description}
              />
            );
          })}
        </ScrollView>
      </View>
    </>
  );
};

export default HomeScreen;

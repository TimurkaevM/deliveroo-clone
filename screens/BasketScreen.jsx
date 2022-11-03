import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectRestaurant } from "../features/restaurantSlice";
import { removeFromBasket, selectBasketItems, selectBasketTotal } from "../features/basketSlice";
import StatusBarPlaceHolder from "../misc/StatusBarPlaceHolder";
import { XCircleIcon } from "react-native-heroicons/solid";
import { urlFor } from "../sanity";
import Currency from "react-currency-formatter";

const BasketScreen = () => {
  const [groupedItemsInBasket, setGroupedItemsInBasket] = useState([]);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const restaurant = useSelector(selectRestaurant);
  const basketTotal = useSelector(selectBasketTotal);
  const items = useSelector(selectBasketItems);

  useEffect(() => {
    const groupedItems = items.reduce((results, item) => {
      (results[item.id] = results[item.id] || []).push(item);
      return results;
    }, {});

    setGroupedItemsInBasket(groupedItems);
  }, [items]);

  return (
    <>
      <StatusBarPlaceHolder />
      <View className="flex-1 bg-white">
        <View className="flex-1 bg-gray-100">
          <View className="p-5 border-b border-[#00ccbb] bg-white shadow-xs">
            <View>
              <Text className="text-lg font-bold text-center">Basket</Text>
              <Text className="text-center text-gray-400">{restaurant.title}</Text>
            </View>
            <TouchableOpacity
              onPress={navigation.goBack}
              className="rounded-full bg-gray-100 absolute top-3 right-5">
              <XCircleIcon color="#00ccbb" size={50} />
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center space-x-4 px-4 py-3 bg-white my-5">
            <Image
              source={{
                uri: "https://images.squarespace-cdn.com/content/v1/557d3619e4b0452ec69c411b/1594826945762-C411RFU5ARHRF6J3TSMJ/deliveroo+PW.png",
              }}
              className="h-7 w-7 bg-gray-300 p-4 rounded-full"
            />
            <Text className="flex-1">Deliver in 50-75 min</Text>
            <TouchableOpacity>
              <Text className="text-[#00ccbb]">Change</Text>
            </TouchableOpacity>
          </View>
          <ScrollView className="divide-y divide-gray-200">
            {Object.entries(groupedItemsInBasket).map(([key, items]) => (
              <View key={key} className="flex-row items-center space-x-3 bg-white py-2 px-5">
                <Text className="text-[#00ccbb]">{items.length} x</Text>
                <Image
                  source={{
                    uri: urlFor(items[0]?.image).url(),
                  }}
                  className="h-12 w-12 rounded-full"
                />
                <Text className="flex-1">{items[0]?.name}</Text>
                <Text className="text-gray-600">
                  <Currency quantity={items[0]?.price} currency="GBP" />
                </Text>
                <TouchableOpacity onPress={() => dispatch(removeFromBasket({ id: key }))}>
                  <Text className="text-[#00ccbb] text-xs">Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View className="p-5 bg-white space-y-4">
            <View className="flex-row justify-between">
              <Text className="text-gray-400">Subtotal</Text>
              <Text className="text-gray-400">
                <Currency quantity={basketTotal} currency="GBP" />
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-400">Delivery Fee</Text>
              <Text className="text-gray-400">
                <Currency quantity={5.99} currency="GBP" />
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text>Order Total</Text>
              <Text className="font-extrabold">
                <Currency quantity={basketTotal + 5.99} currency="GBP" />
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("PreparingOrderScreen")}
              className="rounded-lg bg-[#00ccbb] p-4">
              <Text className="text-white text-center font-bold text-lg">Place Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default BasketScreen;

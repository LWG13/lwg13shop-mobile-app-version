import React, { useState, useEffect, useLayoutEffect } from "react";
import AntDesign from '@expo/vector-icons/AntDesign'
import SkeletonBox from "./skeletonBox"

import { 
  View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, FlatList 
} from "react-native";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useQuery } from "react-query"
import {
  addToCart,
  decreaseCart,
  removeFromCart,
  clearCart,
  getTotals,
} from "./ReduxToolkit/cartSlice";
import { useDispatch } from "react-redux"
export default function ProductDetail() {
  const dispatch = useDispatch()
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params;
  const { data : product, isLoading : productLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => 
    axios
        .get(`https://ecommerce-server-y5yv.onrender.com/product/${productId}`)
        .then((res) => res.data),
  })
  const { data, isLoading  } = useQuery({
    queryKey: ["all",productId],
    queryFn: () =>  
    axios
        .get("https://ecommerce-server-y5yv.onrender.com/product")
        .then((res) => res.data),
      })

  return (
    <>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={50} color="#ffffff" />

        </TouchableOpacity>
        
        <Text style={{color: "white", fontSize: 20, fontWeight: 600}}>Sản phẩm</Text>

        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          <AntDesign name="shoppingcart" size={50} color="#ffffff" />

        </TouchableOpacity>
      </View>
        {productLoading || isLoading ? 
          (
           <View style={styles.loading}>
            <SkeletonBox width={"98%"} height={200} radius={10}/>
            <Text> </Text>
            <SkeletonBox width={"98%"} height={200} radius={10}/>
        <Text> </Text>

          {[1, 2, 3].map((row) => (
            <View key={row} style={styles.skeletonRow}>
              <SkeletonBox width={"48%"} height={200} radius={10} />
              <SkeletonBox width={"48%"} height={200} radius={10} />
            </View>
             ))}
            </View>


            ) : (

      <ScrollView style={styles.container}>
  
        {/* IMAGE */}
        <Image source={{ uri: product?.image }} style={styles.image} />

        {/* TITLE + HEART */}
        <View style={styles.rowBetween}>
          <Text style={styles.title}>{product?.title}</Text>

          <TouchableOpacity>
            
<AntDesign name="heart" size={65} color="red" />
          </TouchableOpacity>
        </View>

        {/* PRICE */}
        <Text style={styles.price}>${product?.price}</Text>

        {/* CATEGORY */}
        <View style={styles.row}>
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{product?.category}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Shipping:</Text>
          <Text style={styles.value}>Free Shipping</Text>
        </View>


        {/* DESCRIPTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text>{product?.description}</Text>
        </View>

        {/* USER PRODUCT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Product</Text>

          <TouchableOpacity style={styles.userBox} onPress={() => navigation.navigate("Profile",{ userId: product?.userId})}>
            <Image source={{ uri: product?.userImage }} style={styles.userImg} />

            <View>
              <Text style={{ fontSize: 22 }}>{product?.username}</Text>
              <Text style={{ color: "gray" }}>Click to see user profile</Text>
            </View>
          </TouchableOpacity>
        </View>
  
        {/* FEATURED PRODUCTS */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { textAlign: "center" }]}>
            Đề xuất sản phẩm
          </Text>

          <FlatList
            data={data}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            renderItem={({ item }) => (
              <TouchableOpacity
            style={styles.itemBox}
            onPress={() =>
              navigation.navigate("ProductDetail", { productId: item._id })
            }
          >
            <Image source={{ uri: item.image }} style={styles.image2} />
            <Text style={styles.title2}>{item.title}</Text>
            <Text style={styles.price2}>${item.price}</Text>

            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
          />
        </View>
      </ScrollView>
    )}

      {/* FIXED BOTTOM */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.btn1}>
          <Text style={styles.btn1Text}>Mua ngay</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn2} onPress={() => dispatch(addToCart(product))}>
          <Text style={styles.btn2Text}>Đặt vào vỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#F5F7F8"},

  header: {
    height: 80,
    paddingTop: 30,
    backgroundColor: "#BF77F6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20
  },
 skeletonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  headerIcon: { width: 40, height: 40 },

  image: {
    width: "100%",
    height: 350,
    marginTop: 80
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 10
  },

  title: { fontSize: 28, fontWeight: "bold" },
  heart: { width: 45, height: 45 },

  price: {
    color: "#BF77F6",
    fontSize: 26,
    marginLeft: 10,
    marginTop: 5
  },

  row: {
    flexDirection: "row",
    paddingHorizontal: 10,
    marginTop: 5
  },

  label: { fontWeight: "bold", fontSize: 18 },
  value: { marginLeft: 10, fontSize: 18 },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15
  },
itemBox: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
  },

  image2: {
    width: "100%",
    height: 140,
    borderRadius: 8,
  },

  title2: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },

  price2: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#BF77F6",
    marginTop: 5,
  },

  categoryTag: {
    backgroundColor: "#BF77F6",
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  categoryText: { color: "white", fontSize: 12 },
  skeletonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  btn1: {
    backgroundColor: "#BF77F6",
    paddingVertical: 15,
    width: "50%",
    alignItems: "center",
    borderRadius: 5
  },
  btn1Text: { color: "white", fontSize: 18 },

  btn2: {
    borderColor: "#BF77F6",
    borderWidth: 2,
    paddingVertical: 15,
    width: "50%",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "white"
  },
  btn2Text: { color: "#BF77F6", fontSize: 18 },

  section: {
    backgroundColor: "white",
    padding: 10,
    marginTop: 20
  },

  sectionTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },

  userBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15
  },

  userImg: {
    width: 90,
    height: 90,
    borderRadius: 50
  },

  featureItem: {
    backgroundColor: "white",
    width: "48%",
    marginBottom: 15,
    padding: 10,
    borderRadius: 10
  },

  featureImage: {
    width: "100%",
    height: 160,
    borderRadius: 10
  },

  featureTitle: {
    fontSize: 16,
    marginTop: 5
  },

  featurePrice: {
    color: "#A868D9",
    marginTop: 5,
    fontSize: 16
  },

  bottomBar: {
    height: 60,
    backgroundColor: "#BF77F6",
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  }
});
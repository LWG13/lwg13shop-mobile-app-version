import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import SkeletonBox from "./skeletonBox";

import axios from "axios";
import { useQuery } from "react-query";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function Profile() {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      axios
        .get(`https://ecommerce-server-y5yv.onrender.com/user/signup/${userId}`)
        .then((res) => res.data),
  });
   
  const { data: latest, isLoading: loadingLatest } = useQuery({
    queryKey: ["latest"],
    queryFn: () =>
      axios
        .get(`https://ecommerce-server-y5yv.onrender.com/product/lastest/${userId}`)
        .then((res) => res.data),
  });


  const user = data;

  return (
    <ScrollView style={styles.container}>
      

      {isLoading ? (
       <View style={styles.loading}>
        <SkeletonBox width={"98%"} height={200} radius={10}/>
        <Text> </Text>
        <SkeletonBox width={"98%"} height={200} radius={10}/>
      </View>
      ) : (
    <View >
      <View style={styles.profileBox}>
        <Image source={{ uri: user?.image }} style={styles.avatar} />
        <Text style={styles.username}>{user?.username}</Text>
      </View>

      <View style={styles.tabList}>
        <TouchableOpacity
          style={[styles.tab, page === 1 && styles.activeTab]}
          onPress={() => setPage(1)}
        >
          <Text style={[styles.tabText, page === 1 && styles.activeTabText]}>
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, page === 2 && styles.activeTab]}
          onPress={() => setPage(2)}
        >
          <Text style={[styles.tabText, page === 2 && styles.activeTabText]}>
            Products
          </Text>
        </TouchableOpacity>
      </View>

          <View style={styles.pageContent}>
           </View>
      <View style={styles.descBox}>
        <Text style={styles.title}>Thông tin tài khoản</Text>
        <Text style={styles.desc}>{user?.desc}</Text>
      </View>

      <View style={styles.line} />

      {/* Latest Product */}
      
        <Text style={styles.title}>Latest Product</Text>

        </View>
)}
      <Text> </Text>
        {loadingLatest ? (
          <View style={{ gap: 15 }}>
        {[1, 2, 3].map((row) => (
          <View key={row} style={styles.skeletonRow}>
            <SkeletonBox width={"48%"} height={200} radius={10} />
            <SkeletonBox width={"48%"} height={200} radius={10} />
          </View>
        ))}
          </View>
        ) : latest?.length === 0 ? (
          <View style={styles.empty}>
            <Text style={{ color: "#ccc" }}>User doesn't have any product</Text>
          </View>
        ) : (
          <View style={styles.productGrid}>
            {latest?.map((item) => (
              <TouchableOpacity
                key={item._id}
                style={styles.productItem}
                onPress={() => navigation.navigate("ProductDetail", { productId: item._id })}
              >
                <Image source={{ uri: item.image }} style={styles.productImg} />

                <Text style={styles.productTitle}>{item.title}</Text>
                <Text style={styles.price}>{item.price}$</Text>

                <View style={styles.categoryBox}>
                  <Text style={styles.category}>{item.category}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 15,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "white",
  },



  back: {
    color: "black",
    fontSize: 18,
  },

  cart: {
    color: "black",
    fontSize: 24,
  },

  profileBox: {
    alignItems: "center",
    marginTop: 20,
    paddingTop: 40,
    paddingBottom: 40,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#BF77F6"
  },
  skeletonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },

  username: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },

  tabList: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
  },

  tabText: {
    color: "black",
    textAlign: "center",
    fontSize: 16,
  },

  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#BF77F6",
  },

  activeTabText: {
    color: "black",
    fontWeight: "bold",
  },

  pageContent: {
    marginTop: 20,
  },

  white: {
    color: "black",
  },
   descBox: { marginBottom: 20 },
  title: { color: "black", fontSize: 20, marginBottom: 6, fontWeight: "bold" },
  desc: { color: "black", fontSize: 15 },
  line: {
    height: 1,
    backgroundColor: "black",
    width: "100%",
    marginVertical: 16,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productItem: {
    width: "48%",
      backgroundColor: "#fff",
      padding: 10,
      marginBottom: 15,
      borderRadius: 10,
      elevation: 3,
  },
  productImg: { width: "100%", height: 120, borderRadius: 10 },
  productTitle: { color: "black", marginTop: 6, fontSize: 16 },
  price: { color: "#BF77F6", marginTop: 4, fontWeight: "bold" },
  categoryBox: {
    backgroundColor: "#BF77F6",
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  category: { color: "white", fontSize: 12 },
  empty: { paddingVertical: 20, alignItems: "center" },
});




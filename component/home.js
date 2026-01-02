import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import SkeletonBox from "./skeletonBox";
export default function Product() {
  const navigation = useNavigation();

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      axios
        .get("https://ecommerce-server-y5yv.onrender.com/product")
        .then((res) => res.data),
  });

  // ======================================================
  // 🟦 SKELETON LOADING (REACT-NATIVE-SKELETON-PLACEHOLDER)
  // ======================================================
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Đề xuất sản phẩm</Text>

          <View style={{ gap: 15 }}>
        {[1, 2, 3].map((row) => (
          <View key={row} style={styles.skeletonRow}>
            <SkeletonBox width={"48%"} height={200} radius={10} />
            <SkeletonBox width={"48%"} height={200} radius={10} />
          </View>
        ))}
      </View>
      </View>
    );
  }

  // ======================================================
  // 🟩 REAL CONTENT SAU KHI LOAD XONG
  // ======================================================
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Đề xuất sản phẩm</Text>

      <FlatList
        data={data}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemBox}
            onPress={() =>
              navigation.navigate("ProductDetail", { productId: item._id })
            }
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>${item.price}</Text>

            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity onPress={() => navigation.navigate("Category")}>
        <View style={styles.moreButton}>
          <Text style={styles.moreButtonText}>Look More</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },

  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "black"
  },

  itemBox: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 140,
    borderRadius: 8,
  },

  title: {
    fontSize: 16,
    color: "black",
    fontWeight: "600",
    marginTop: 10,
  },

  price: {
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

  skeletonCard: {
    width: "48%",
    height: 200,
    borderRadius: 10,
  },

  moreButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  moreButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
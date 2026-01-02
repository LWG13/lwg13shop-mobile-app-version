import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign'

import { useNavigation } from "@react-navigation/native"
import axios from "axios"
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import SkeletonBox from "./skeletonBox";
import { useQuery } from "@tanstack/react-query"
export default function SearchScreen() {
  const [keyword, setKeyword] = useState("");
  const [key, setKey] = useState("");
  const navigation = useNavigation()
  const { data, isLoading} = useQuery({
   queryKey: ["search", key],
    queryFn: () =>
      axios
        .get(`https://ecommerce-server-y5yv.onrender.com/product/products/getSearch?search=${key}`)
        .then((res) => res.data)
  })
  const handleSearch = async () => {
    if (!keyword.trim()) return;

    setKey(keyword)
  };

  
  return (
    <View style={styles.container}>
       <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={50} color="#ffffff" />

        </TouchableOpacity>
        
        <Text style={{color: "white", fontSize: 20, fontWeight: 600, marginLeft: "21%"}}>Tìm Kiếm</Text>

       </View>
     
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          placeholder="Tìm sản phẩm..."
          value={keyword}
          onChangeText={setKeyword}
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="arrow-forward-circle" size={26} color="#007AFF" />
        </TouchableOpacity>
      </View>
      {isLoading ? (
       <View style={{ gap: 15 }}>
        {[1, 2, 3].map((row) => (
          <View key={row} style={styles.skeletonRow}>
            <SkeletonBox width={"48%"} height={200} radius={10} />
            <SkeletonBox width={"48%"} height={200} radius={10} />
          </View>
        ))}
      </View>
      ) : 
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
        ListEmptyComponent={
          <Text style={styles.empty}>Không có kết quả</Text>
        }
      />
      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  
  searchBar: {
    flexDirection: "row",
    marginTop: 90,
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },

  input: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 16,
    color: "black"
  },

  item: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fafafa",
    borderRadius: 10,
    marginBottom: 12,
  },
  headerIcon: { width: 40, height: 40 },
  header: {
    height: 80,
    paddingTop: 30,
    backgroundColor: "#BF77F6",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20
  },

  image: {
    width: 60,
    height: 60,
    backgroundColor: "#ddd",
    borderRadius: 8,
    marginRight: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "black"
  },

  price: {
    marginTop: 4,
    color: "#007AFF",
  },

  empty: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
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
    fontWeight: "600",
    marginTop: 10,
    color: "black"
  },

  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#BF77F6",
    marginTop: 5,
    color: "black"
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

});
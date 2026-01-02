import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import SkeletonBox from "./skeletonBox";
import { logoutUser, editProfile } from "./ReduxToolkit/authSlice";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Entypo from '@expo/vector-icons/Entypo';

export default function Profile() {
  const auth = useSelector(state => state.auth);
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;
  const dispatch = useDispatch();

  // query user
  const { data, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      axios
        .get(`https://ecommerce-server-y5yv.onrender.com/user/signup/${userId}`)
        .then(res => res.data),
  });

  // query latest products
  const { data: latest, isLoading: loadingLatest } = useQuery({
    queryKey: ["latest", userId],
    queryFn: () =>
      axios
        .get(`https://ecommerce-server-y5yv.onrender.com/product/lastest/${userId}`)
        .then(res => res.data),
  });

  const user = data || {};
  
  // Fallback state
  const [username, setUsername] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setImage(user.image || "");
    }
  }, [user]);

  useEffect(() => {
    if (auth._id === null) navigation.replace("Login");
  }, [auth._id]);

  const [isEdit, setIsEdit] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Cần quyền truy cập thư viện ảnh");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <View style={styles.loading}>
          <SkeletonBox width={"98%"} height={200} radius={10} />
          <Text> </Text>
          <SkeletonBox width={"98%"} height={200} radius={10} />
        </View>
      ) : (
        <View>
          <View style={styles.profileBox}>
            <Image
              source={
                image
                  ? { uri: image }
                  : user?.image
                  ? { uri: user.image }
                  : "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png" // fallback local
              }
              style={styles.avatar}
            />
            {isEdit && (
              <Entypo name="image" size={40} color="#ffffff" onPress={pickImage} />
            )}

            {isEdit ? (
              <TextInput
                placeholder="Tên"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
              />
            ) : (
              <Text style={styles.username}>{user.username || "Unknown"}</Text>
            )}

            {auth._id === user._id && (
              isEdit ? (
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    dispatch(
                      editProfile({
                        _id: userId,
                        username: username,
                        image: image,
                        password: auth.password,
                        email: auth.email,
                        phoneNumber: auth.phoneNumber,
                        desc: auth.desc,
                      })
                    );
                    setIsEdit(false);
                  }}
                >
                  <Text style={{ color: "black" }}>Lưu</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => dispatch(logoutUser())}
                  >
                    <Text style={{ color: "black" }}>Đăng xuất</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setIsEdit(true)}
                  >
                    <Text style={{ color: "black" }}>Chỉnh sửa</Text>
                  </TouchableOpacity>
                </View>
              )
            )}
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

          <View style={styles.pageContent}></View>

          <View style={styles.descBox}>
            <Text style={styles.title}>Thông tin tài khoản</Text>
            <Text style={styles.desc}>{user.desc || "Chưa có mô tả"}</Text>
          </View>

          <View style={styles.line} />

          <Text style={styles.title}>Latest Product</Text>

          {loadingLatest ? (
            <View style={{ gap: 15 }}>
              {[1, 2, 3].map((row) => (
                <View key={row} style={styles.skeletonRow}>
                  <SkeletonBox width={"48%"} height={200} radius={10} />
                  <SkeletonBox width={"48%"} height={200} radius={10} />
                </View>
              ))}
            </View>
          ) : Array.isArray(latest) && latest.length > 0 ? (
            <View style={styles.productGrid}>
              {latest.map((item) => (
                <TouchableOpacity
                  key={item._id}
                  style={styles.productItem}
                  onPress={() =>
                    navigation.navigate("ProductDetail", { productId: item._id })
                  }
                >
                  <Image
                    source={{ uri: item.image || "https://img.icons8.com/pulsar-line/1200/image.jpg" }}
                    style={styles.productImg}
                  />
                  <Text style={styles.productTitle}>{item.title || "No title"}</Text>
                  <Text style={styles.price}>{item.price ? item.price + "$" : "-"}</Text>
                  <View style={styles.categoryBox}>
                    <Text style={styles.category}>{item.category || "Unknown"}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={{ color: "#ccc" }}>User doesn't have any product</Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "white", flex: 1, padding: 15 },
  loading: { flex: 1, justifyContent: "center", flexDirection: "column", backgroundColor: "white" },
  input: { borderWidth: 1, borderColor: "#000", borderRadius: 5, height: 45, width: "100%", paddingLeft: 12, paddingRight: 40, color: "black" },
  profileBox: { alignItems: "center", marginTop: 20, paddingTop: 40, paddingBottom: 40, borderRadius: 10, marginBottom: 20, backgroundColor: "#BF77F6" },
  skeletonRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  username: { color: "white", fontSize: 22, fontWeight: "bold" },
  tabList: { flexDirection: "row", marginTop: 20, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: "#444" },
  tab: { flex: 1, paddingVertical: 12 },
  tabText: { color: "black", textAlign: "center", fontSize: 16 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#BF77F6" },
  activeTabText: { color: "black", fontWeight: "bold" },
  pageContent: { marginTop: 20 },
  descBox: { marginBottom: 20 },
  title: { color: "black", fontSize: 20, marginBottom: 6, fontWeight: "bold" },
  desc: { color: "black", fontSize: 15 },
  line: { height: 1, backgroundColor: "black", width: "100%", marginVertical: 16 },
  productGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  productItem: { width: "48%", backgroundColor: "#fff", padding: 10, marginBottom: 15, borderRadius: 10, elevation: 3 },
  productImg: { width: "100%", height: 120, borderRadius: 10 },
  productTitle: { color: "black", marginTop: 6, fontSize: 16 },
  price: { color: "#BF77F6", marginTop: 4, fontWeight: "bold" },
  categoryBox: { backgroundColor: "#BF77F6", marginTop: 6, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, alignSelf: "flex-start" },
  category: { color: "white", fontSize: 12 },
  empty: { paddingVertical: 20, alignItems: "center" },
  saveButton: { width: 110, height: 40, borderRadius: 10, backgroundColor: "white", justifyContent: "center", alignItems: "center", marginTop: 10 },
  logoutButton: { width: 110, height: 40, borderRadius: 10, backgroundColor: "white", justifyContent: "center", alignItems: "center" },
  editButton: { width: 110, height: 40, borderRadius: 10, backgroundColor: "white", justifyContent: "center", alignItems: "center", marginLeft: 15 },
});
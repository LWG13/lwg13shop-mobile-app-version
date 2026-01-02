import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decreaseCart,
  removeFromCart,
  clearCart,
  getTotals,
} from "./ReduxToolkit/cartSlice";
import { useNavigation } from "@react-navigation/native";

export default function Cart() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getTotals(cart));
  }, [cart, dispatch]);

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Pressable onPress={() => navigation.navigate("Product", { productId: item._id })}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </Pressable>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.price}>
          ${item.price * item.cartQuantity}
        </Text>

        <View style={styles.actions}>
          <Pressable onPress={() => dispatch(decreaseCart(item))}>
            <Text style={styles.btn}>-</Text>
          </Pressable>

          <Text style={styles.qty}>{item.cartQuantity}</Text>

          <Pressable onPress={() => dispatch(addToCart(item))}>
            <Text style={styles.btn}>+</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => dispatch(removeFromCart(item))}>
          <Text style={styles.remove}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );

  if (cart.cartItem.length === 0) {
    return (
      <View style={styles.empty}>
        <Text>Your cart is empty</Text>
        <Pressable onPress={() => navigation.navigate("Home")}>
          <Text style={styles.link}>Start shopping</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart.cartItem}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />

      <View style={styles.summary}>
        <Pressable onPress={() => dispatch(clearCart())}>
          <Text style={styles.clear}>Clear Cart</Text>
        </Pressable>

        <View style={styles.subtotal}>
          <Text style={{color: "black"}}>Subtotal:</Text>
          <Text style={styles.amount}>${cart.cartTotalAmount}</Text>
        </View>

        <Pressable
          style={styles.checkout}
          onPress={() =>
            auth.token
              ? navigation.navigate("Checkout")
              : navigation.navigate("Login")
          }
        >
          <Text style={styles.checkoutText}>
            {auth._id ? "Check Out" : "Login to check out"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },

  info: { flex: 1, marginLeft: 10 },

  title: { fontSize: 16, fontWeight: "600", color: "black" },

  price: { color: "#BF77F6", marginVertical: 4 },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },

  btn: {
    backgroundColor: "#BF77F6",
    color: "#fff",
    paddingHorizontal: 12,
    fontSize: 18,
    borderRadius: 4,
  },

  qty: { marginHorizontal: 10 },

  remove: { color: "red", marginTop: 6 },

  summary: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 10,
  },

  subtotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  amount: { fontWeight: "700", color: "black" },

  clear: { color: "red", marginBottom: 10 },

  checkout: {
    backgroundColor: "#BF77F6",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  checkoutText: { color: "#fff", fontSize: 16 },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  link: { color: "#BF77F6", marginTop: 10 },
});

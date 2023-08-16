import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Cart, CartItem } from "../models/cart.model";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class CartService {
  cart = new BehaviorSubject<Cart>({ items: [] });

  constructor(private _snackBar: MatSnackBar) {}

  addToCart(item: CartItem): void {
    // get existing items array
    const items = [...this.cart.value.items];

    // check if item exists in cart already
    const itemInCart = items.find((_item) => _item.id === item.id);
    if (itemInCart) {
      // increase the quantity if it exists
      itemInCart.quantity += 1;
    } else {
      // add the item to the array if it doesn't
      items.push(item);
    }

    // update localStorage
    localStorage.setItem("cart", JSON.stringify(items));
    // push to behavior subject
    this.cart.next({ items });
    // push notification
    this._snackBar.open("1 item added to cart. ", "Ok", { duration: 3000 });
  }

  getTotal(items: Array<CartItem>): number {
    // multiply each item's price and quantity to get the total
    return items
      .map((item) => item.price * item.quantity)
      .reduce((curr, prev) => curr + prev, 0);
  }

  loadCart(): Cart {
    // get object from localStorage
    const ls = localStorage.getItem("cart");
    // check if localStorage is empty, if yes return an empty array, else return the saved cart
    const items = ls ? JSON.parse(ls) : [];
    // push to all class that subscribed to cart
    this.cart.next({ items });

    return this.cart.value;
  }

  clearCart(): void {
    // clear cart from localStorage
    try {
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("localStorage is empty", error);
    }

    // clear cart from local behavior object
    this.cart.next({ items: [] });

    // push notification
    this._snackBar.open("Cart is cleared.", "Ok", { duration: 3000 });
  }

  removeFromCart(item: CartItem, update = true): Array<CartItem> {
    // return a filtered array without the selected cartItem
    const filteredItems = this.cart.value.items.filter(
      (_item) => _item.id !== item.id
    );

    // push filtered array to localStorage
    try {
      localStorage.setItem("cart", JSON.stringify(filteredItems));
    } catch (error) {
      console.error("localStorage is empty", error);
    }

    if (update) {
      // push filtered array to behavior object
      this.cart.next({ items: filteredItems });
      // push notification
      this._snackBar.open("1 item removed from cart.", "Ok", {
        duration: 3000,
      });
    }

    return filteredItems;
  }

  removeQuantity(item: CartItem): void {
    // declare variable to be remove from cart
    let itemForRemoval: CartItem | undefined;

    let filteredItems = this.cart.value.items.map((_item) => {
      if (_item.id === item.id) {
        // decrease quantity by one if the id match
        _item.quantity--;

        // remove the item from cart if the quantity reaches 0
        if (_item.quantity === 0) {
          itemForRemoval = _item;
        }
      }
      return _item;
    });

    // remove the item from cart and get the updated filtered items
    if (itemForRemoval) {
      filteredItems = this.removeFromCart(itemForRemoval);
    }

    // update behavior subject
    this.cart.next({ items: filteredItems });
    // update localStorage
    localStorage.setItem("cart", JSON.stringify(this.cart.value.items));
    // push notification
    this._snackBar.open("1 item removed from cart", "Ok", { duration: 3000 });
  }
}
